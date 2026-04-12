// d:\gpacalc\src\utils\parseTable.js

export function parseTableText(text) {
  // Normalize spacing across everything
  const cleanedText = text.trim().replace(/[ \t]+/g, ' ');
  const lines = cleanedText.split('\n').map((line) => line.trim()).filter(Boolean);
  let semester = null;
  const parsedRows = [];
  let skippedCount = 0;

  for (const line of lines) {
    // 1. Detect Semester
    const semMatch = line.match(/(?:Fall|Winter|Spring|Summer)?\s*Semester\s*(?:\d{4}-\d{2}|\d+)/i);
    if (semMatch && !semester) {
      semester = semMatch[0].trim();
      continue;
    }

    // 2. Flexible Row Detection
    const hasSlNo = /^\d+\s+/.test(line);
    const codeMatch = line.match(/([A-Z]{3,}\d{3,}[A-Z]?)/);

    // If it doesn't look remotely like a row, optionally ignore it completely
    // But if it has a code match, we should try parsing it.
    if (!hasSlNo && !codeMatch) {
      continue; // completely irrelevant text (like headers)
    }

    if (!codeMatch) {
      skippedCount++;
      continue;
    }

    const code = codeMatch[1];
    const codeIndex = line.indexOf(code);
    const restOfLine = line.slice(codeIndex + code.length).trim();
    
    if (!restOfLine) {
      skippedCount++;
      continue;
    }

    const parts = restOfLine.split(' ');

    // 3. Safe Grade Extraction
    let grade = null;
    let gradeIndex = -1;
    const validGrades = ['S', 'A+', 'A', 'B+', 'B', 'C', 'D', 'E', 'F', 'N', 'U', 'P'];
    
    for (let i = parts.length - 1; i >= 0; i--) {
      const token = parts[i].toUpperCase();
      if (validGrades.includes(token)) {
        grade = token;
        gradeIndex = i;
        break;
      }
    }

    if (!grade) {
      skippedCount++;
      continue;
    }

    // 4. Credit Extraction
    let credits = null;
    let creditIndex = -1;

    for (let i = gradeIndex - 1; i >= 0; i--) {
      const val = parseFloat(parts[i]);
      if (!isNaN(val) && val >= 0.5 && val <= 10) {
        credits = val;
        creditIndex = i;
        break;
      }
    }

    if (credits === null) {
      skippedCount++;
      continue;
    }

    // 5. Subject Name Extraction
    let nameEndIndex = creditIndex - 1;
    while (nameEndIndex >= 0) {
      const val = parseFloat(parts[nameEndIndex]);
      if (isNaN(val)) break; // non-numeric prefix
      nameEndIndex--;
    }

    if (nameEndIndex < 0) {
      skippedCount++;
      continue;
    }

    let rawSubject = parts.slice(0, nameEndIndex + 1).join(' ').trim();
    const cleanupRegex = /\s+(Online Course|Embedded Theory and Lab|Lab Only|Theory Only|Soft Skill)$/i;
    rawSubject = rawSubject.replace(cleanupRegex, '').trim();

    parsedRows.push({
      subject: rawSubject,
      credits: credits.toString(),
      grade: grade,
      code: code,
    });
  }

  return { 
    semester, 
    parsedRows,
    parsedCount: parsedRows.length,
    skippedCount
  };
}
