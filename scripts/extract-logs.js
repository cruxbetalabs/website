#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Parses HTML comments from markdown content
 * Looks for comments in format: <!-- key: value -->
 * @param {string} content - Markdown file content
 * @returns {object} Parsed attributes
 */
function parseMarkdownComments(content) {
  const attributes = {};
  const commentRegex = /<!--\s*([^:]+):\s*(.*?)\s*-->/g;
  let match;

  while ((match = commentRegex.exec(content)) !== null) {
    const key = match[1].trim();
    const value = match[2].trim();
    attributes[key] = value;
  }

  return attributes;
}

/**
 * Compares two log entries by date (descending order - newest first)
 * @param {object} a - First log entry
 * @param {object} b - Second log entry
 * @returns {number} Comparison result for sorting
 */
function compareByDate(a, b) {
  const dateA = a.date ? new Date(a.date) : new Date(0);
  const dateB = b.date ? new Date(b.date) : new Date(0);
  return dateB - dateA; // Descending order (newest first)
}

/**
 * Updates logs.json with metadata from a markdown file
 * @param {string} markdownFilePath - Path to markdown file
 * @param {string} logsJsonPath - Path to logs.json
 */
function extractAndUpdateLogs(markdownFilePath, logsJsonPath) {
  try {
    // Read markdown file
    const markdownContent = fs.readFileSync(markdownFilePath, 'utf8');
    const parsedAttributes = parseMarkdownComments(markdownContent);

    if (Object.keys(parsedAttributes).length === 0) {
      console.log(`No HTML comments found in ${markdownFilePath}`);
      return;
    }

    // Read existing logs.json
    const logsData = JSON.parse(fs.readFileSync(logsJsonPath, 'utf8'));

    // Get file name without extension for ID
    const fileName = path.basename(markdownFilePath, '.md');
    const relativeFilePath = path.relative(
      path.dirname(logsJsonPath),
      markdownFilePath
    );

    // Find or create log entry
    let logEntry = logsData.logs.find(log => log.id === fileName);

    if (!logEntry) {
      logEntry = { id: fileName, file: relativeFilePath };
      logsData.logs.push(logEntry);
    }

    // Merge parsed attributes into log entry
    Object.assign(logEntry, parsedAttributes);

    // Sort logs by date (newest first) if date field exists
    logsData.logs.sort(compareByDate);

    // Write updated logs.json
    fs.writeFileSync(logsJsonPath, JSON.stringify(logsData, null, 4) + '\n');

    console.log(`✓ Updated logs.json with metadata from ${markdownFilePath}`);
    console.log(`  Attributes: ${JSON.stringify(parsedAttributes)}`);
  } catch (error) {
    console.error(`Error processing ${markdownFilePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Main function - processes command line arguments
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node extract-logs.js <markdown-file> [logs.json-path]');
    console.log('');
    console.log('Examples:');
    console.log('  node extract-logs.js logs/my-entry.md');
    console.log('  node extract-logs.js logs/my-entry.md logs.json');
    console.log('');
    console.log('HTML Comment Format:');
    console.log('  <!-- title: My Log Title -->');
    console.log('  <!-- date: 2026-01-05 -->');
    console.log('  <!-- category: snippet -->');
    process.exit(1);
  }

  const markdownFile = args[0];
  const logsJsonPath = args[1] || path.join(path.dirname(markdownFile), '..', 'logs', 'logs.json');

  // Validate markdown file exists
  if (!fs.existsSync(markdownFile)) {
    console.error(`Error: Markdown file not found: ${markdownFile}`);
    process.exit(1);
  }

  // Validate logs.json exists
  if (!fs.existsSync(logsJsonPath)) {
    console.error(`Error: logs.json not found: ${logsJsonPath}`);
    process.exit(1);
  }

  extractAndUpdateLogs(markdownFile, logsJsonPath);
}

main();
