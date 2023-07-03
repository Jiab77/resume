#!/usr/bin/env node

/*
Basic JSON resume rendering script
Made by Jiab77 - 2023

Schema:
 - Similar but not compatible with the JSON Resume schema.

Reason:
 - Written before discovering the JSON Resume project...

Version 0.0.0
*/

'use strict';

// Modules
const fs = require('node:fs');
const path = require('path');
const { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } = require("docx");

// Config
const dataFile = 'resume.public.json';

// Options
const options = {
    "debugMode": true
};

// Features
const features = {
    "md": true,
    "html": true,
    "docx": false
};

// Internals
const scriptFile = path.basename(__filename);
const scriptPath = path.resolve(__dirname);
const dataFilePath = `${scriptPath}/${dataFile}`;

// Methods
function readJSON(file) {
    try {
        const data = fs.readFileSync(file, 'utf8');
        const parsed = JSON.parse(data);
        if (options.debugMode === true) {
            console.log(`[${scriptFile}] debug - received data:\n\n${data}\n`);
            console.log(`[${scriptFile}] debug - parsed data:\n\n${JSON.stringify(parsed)}\n`);
        }
        return parsed;
    } catch (err) {
        console.error(`[${scriptFile}] error: ${err}`);
        return false;
    }
}
function writeOutput(file, data, format) {
    try {
        // Debug
        if (options.debugMode === true) {
            console.log(`[${scriptFile}] debug - received path: ${file}`);
        }

        // Split file name and extension from given path
        const baseFilename = path.basename(file);
        const baseDir = path.dirname(file);
        const splitFilename = baseFilename.split('.');
        const filenameParts = splitFilename.length;
        let outputFilename = '';

        // Debug
        if (options.debugMode === true) {
            console.log(`[${scriptFile}] debug - input file: ${baseFilename}`);
            console.log(`[${scriptFile}] debug - base dir: ${baseDir}`);
        }

        // Change output file extension based on passed format
        for (let index = 0; index < (filenameParts - 1); index++) {
            outputFilename += `${splitFilename[index]}.`;
        }
        outputFilename += format;
        if (options.debugMode === true) {
            console.log(`[${scriptFile}] debug - output path: ${baseDir}/${outputFilename}`);
        }

        // Write data to given path
        fs.writeFileSync(outputFilename, data);
        if (options.debugMode === true) {
            console.log(`[${scriptFile}] debug - written data:\n\n${data}\n`);
        }

        return true;
    } catch (err) {
        console.error(`[${scriptFile}] error: ${err}`);
        return false;
    }
}
function init_rendering() {
    const userData = readJSON(dataFilePath);
    const isLoaded = userData.hasOwnProperty('basics') ? true : false;
    let rendered, format;

    if (options.debugMode === true) {
        console.log(`[${scriptFile}] debug - loading test: ${isLoaded === true ? 'success' : 'fail'}`);
    }
    if (!isLoaded) {
        console.error(`[${scriptFile}] error: could not load JSON file '${dataFile}'.`);
        return false;
    }
    if (options.debugMode === true) {
        console.log(`[${scriptFile}] debug - loaded user: ${userData.basics.name}`);
    }
    if (features.md === true) {
        format = 'md';
        rendered = render_md(userData);
        if (typeof rendered !== 'undefined') {
            if (options.debugMode === true) {
                console.log(`[${scriptFile}] debug - rendered markdown:\n\n${rendered}\n`);
            }
            writeOutput(dataFilePath, rendered, format);
        }
        else {
            console.error(`[${scriptFile}] error: could not render JSON file '${dataFile}' to markdown.`);
            return false;
        }
    }
    if (features.html === true) {
        format = 'html';
        rendered = render_html(userData);
        if (typeof rendered !== 'undefined') {
            if (options.debugMode === true) {
                console.log(`[${scriptFile}] debug - rendered html:\n\n${rendered}\n`);
            }
            writeOutput(dataFilePath, rendered, format);
        }
        else {
            console.error(`[${scriptFile}] error: could not render JSON file '${dataFile}' to html.`);
            return false;
        }
    }
}
function render_md(data) {
    // Rendered string
    let output = '';
    
    // Basics
    if (data.hasOwnProperty('basics')) {
        output += '<div align="center">';
        output += `<h1>${data.basics.name}</h1>`;
        output += `<h2>${data.basics.label}</h2>`;
        output += `<h4><em>${data.basics.summary}</em></h4>`;
        output += '</div>';
        output += '<hr>';
    }

    // Sub section | start
    output += '<table>';
    output += '<tbody>';
    output += '<tr>';

    // Identity
    output += '<td width="300px" valign="top">';
    output += `<strong>Address:</strong>&nbsp;${data.basics.location.address.replaceAll('\n', '<br>')}<br>`;
    if (data.basics.phone !== '') {
        if (data.basics.phone === 'REDACTED') {
            output += `<strong>Phone:</strong>&nbsp;${data.basics.phone}`;
        }
        else {
            output += `<strong>Phone:</strong>&nbsp;<a href="tel:${data.basics.phone}">${data.basics.phone}</a>`;
        }
    }
    if (data.basics.email !== '') {
        if (data.basics.email === 'REDACTED') {
            output += `<br><strong>eMail:</strong>&nbsp;${data.basics.email}`;
        }
        else {
            output += `<br><strong>eMail:</strong>&nbsp;<a href="mailto:${data.basics.email}">${data.basics.email}</a>`;
        }
    }
    if (data.basics.url !== '') {
        output += `<br><strong>Website:</strong>&nbsp;<a href="${data.basics.url}">${data.basics.url}</a>`;
    }
    output += '</td>';

    // Spacing
    output += '<td width="300px">&nbsp;</td>';

    // Status
    if (data.hasOwnProperty('status')) {
        output += '<td width="300px" valign="top" align="right" dir="rtl">';
        output += `<strong>Date&nbsp;of&nbsp;birth:</strong>&nbsp;${data.status.dob}<br>`;
        output += `<strong>Nationality:</strong>&nbsp;${data.status.nationality}<br>`;
        output += `<strong>Status:</strong>&nbsp;${data.status.life}<br>`;
        output += `<strong>Permit:</strong>&nbsp;${data.status.paper}`;
        output += '</td>';
    }

    // Sub section | end
    output += '</tr>';
    output += '</tbody>';
    output += '</table>';
    output += `<br>\n`;

    // Sections
    if (data.hasOwnProperty('sections')) {
        if (data.sections.length > 0) {
            // Section blocks
            data.sections.forEach((section) => {
                // Section title
                output += `\n## ${section.title}\n`;

                // Section content | start
                output += `\n<table>`;
                output += '<tbody>';

                // Section entries
                if (section.entries.length > 0) {
                    // Entries blocks
                    section.entries.forEach((entry) => {
                        // Experiences
                        if (entry.hasOwnProperty('range') && entry.hasOwnProperty('activities')) {
                            // Entry content | start
                            output += '<tr>';
                            output += `<td width="200px" valign="top"><ins>${entry.company}</ins></td>`;
                            output += '<td width="500px">';
                            output += `<strong>${entry.position}</strong>&nbsp;&ndash;&nbsp;${entry.location}`;

                            // Activities
                            if (entry.activities.length > 0) {
                                output += '<br><br>';
                                output += '<ul>';
                                entry.activities.forEach((activity) => {
                                    output += `<li>${activity.domain}<br>`;

                                    // Tasks
                                    if (activity.tasks.length > 0) {
                                        output += '<ul>';
                                        activity.tasks.forEach((task) => {
                                            output += `<li>${task}</li>`;
                                        });
                                        output += '</ul>';
                                    }

                                    output += '</li>';
                                    output += '<br>';
                                });
                                output += '</ul>';
                            }

                            // Entry content | end
                            output += '</td>';
                            output += `<td width="200px" valign="top" align="right">${entry.range.start}&nbsp;&ndash;&nbsp;${entry.range.end}</td>`;
                            output += '</tr>';
                        }

                        // Certifications + Exams
                        else if (entry.hasOwnProperty('date')) {
                            // Entry content
                            output += '<tr>';
                            output += `<td width="200px"><ins>${entry.date}</ins></td>`;
                            output += `<td width="700px">${entry.name}</td>`;
                            output += '</tr>';
                        }

                        // Languages
                        else if (entry.hasOwnProperty('level')) {
                            // Entry content
                            output += '<tr>';
                            output += `<td width="200px"><ins>${entry.name}</ins></td>`;
                            output += `<td width="700px">${entry.level}</td>`;
                            output += '</tr>';
                        }
                        
                        // Skills
                        else if (!entry.hasOwnProperty('range') && entry.hasOwnProperty('activities')) {
                            // Entry content | start
                            output += '<tr>';
                            output += `<td width="200px" valign="top"><strong>${entry.domain}</strong></td>`;
                            output += '<td width="700px" valign="top">';

                            // Activities
                            if (entry.activities.length > 0) {
                                output += '<br>';
                                output += '<ul>';
                                entry.activities.forEach((activity) => {
                                    output += `<li><ins>${activity.name}:</ins>&nbsp;${activity.description}</li>`;
                                });
                                output += '</ul>';
                                output += '<br>';
                            }

                            // Entry content | end
                            output += '</td>';
                            output += '</tr>';
                        }

                        // Interests
                        else {
                            // Entry content
                            output += '<tr>';
                            output += `<td width="900px">&bull;&nbsp;&nbsp;${entry.name}</td>`;
                            output += '</tr>';
                        }
                    });
                }

                // Section content | end
                output += '</tbody>';
                output += '</table>';
                output += `<br>\n`;
            });
        }
    }

    // Return generated string
    return output;
}
function render_html(data) {
    // Rendered string
    let output = '<html>';
    output += '<head>';
    output += '<title>Resume</title>';
    if (data.hasOwnProperty('meta')) {
        output += `<link rel="stylesheet" href="${data.meta.theme}.css">`
    }
    output += '</head>';
    output += '<body>';
    
    // Header
    if (data.hasOwnProperty('basics')) {
        output += '<div align="center">';
        output += `<h1>${data.basics.name}</h1>`;
        output += `<h2>${data.basics.label}</h2>`;
        output += `<h4><em>${data.basics.summary}</em></h4>`;
        output += '</div>';
        output += '<hr>';
    }

    // Sub section | start
    output += '<table>';
    output += '<tbody>';
    output += '<tr>';

    // Identity
    output += '<td width="300px" valign="top">';
    output += `<strong>Address:</strong>&nbsp;${data.basics.location.address.replaceAll('\n', '<br>')}<br>`;
    if (data.basics.phone !== '') {
        if (data.basics.phone === 'REDACTED') {
            output += `<strong>Phone:</strong>&nbsp;${data.basics.phone}`;
        }
        else {
            output += `<strong>Phone:</strong>&nbsp;<a href="tel:${data.basics.phone}">${data.basics.phone}</a>`;
        }
    }
    if (data.basics.email !== '') {
        if (data.basics.email === 'REDACTED') {
            output += `<br><strong>eMail:</strong>&nbsp;${data.basics.email}`;
        }
        else {
            output += `<br><strong>eMail:</strong>&nbsp;<a href="mailto:${data.basics.email}">${data.basics.email}</a>`;
        }
    }
    if (data.basics.url !== '') {
        output += `<br><strong>Website:</strong>&nbsp;<a href="${data.basics.url}">${data.basics.url}</a>`;
    }
    output += '</td>';

    // Spacing
    output += '<td width="300px">&nbsp;</td>';

    // Status
    if (data.hasOwnProperty('status')) {
        output += '<td width="300px" valign="top" align="right" dir="rtl">';
        output += `<strong>Date&nbsp;of&nbsp;birth:</strong>&nbsp;${data.status.dob}<br>`;
        output += `<strong>Nationality:</strong>&nbsp;${data.status.nationality}<br>`;
        output += `<strong>Status:</strong>&nbsp;${data.status.life}<br>`;
        output += `<strong>Permit:</strong>&nbsp;${data.status.paper}`;
        output += '</td>';
    }

    // Sub section | end
    output += '</tr>';
    output += '</tbody>';
    output += '</table>';
    output += `<br>\n`;

    // Sections
    if (data.hasOwnProperty('sections')) {
        if (data.sections.length > 0) {
            // Section blocks
            data.sections.forEach((section) => {
                // Section title
                output += `\n<h2>${section.title}</h2>\n`;

                // Section content | start
                output += `\n<table>`;
                output += '<tbody>';

                // Section entries
                if (section.entries.length > 0) {
                    // Entries blocks
                    section.entries.forEach((entry) => {
                        // Experiences
                        if (entry.hasOwnProperty('range') && entry.hasOwnProperty('activities')) {
                            // Entry content | start
                            output += '<tr>';
                            output += `<td width="200px" valign="top"><ins>${entry.company}</ins></td>`;
                            output += '<td width="500px">';
                            output += `<strong>${entry.position}</strong>&nbsp;&ndash;&nbsp;${entry.location}`;

                            // Activities
                            if (entry.activities.length > 0) {
                                output += '<br><br>';
                                output += '<ul>';
                                entry.activities.forEach((activity) => {
                                    output += `<li>${activity.domain}<br>`;

                                    // Tasks
                                    if (activity.tasks.length > 0) {
                                        output += '<ul>';
                                        activity.tasks.forEach((task) => {
                                            output += `<li>${task}</li>`;
                                        });
                                        output += '</ul>';
                                    }

                                    output += '</li>';
                                    output += '<br>';
                                });
                                output += '</ul>';
                            }

                            // Entry content | end
                            output += '</td>';
                            output += `<td width="200px" valign="top" align="right">${entry.range.start}&nbsp;&ndash;&nbsp;${entry.range.end}</td>`;
                            output += '</tr>';
                        }

                        // Certifications + Exams
                        else if (entry.hasOwnProperty('date')) {
                            // Entry content
                            output += '<tr>';
                            output += `<td width="200px"><ins>${entry.date}</ins></td>`;
                            output += `<td width="700px">${entry.name}</td>`;
                            output += '</tr>';
                        }

                        // Languages
                        else if (entry.hasOwnProperty('level')) {
                            // Entry content
                            output += '<tr>';
                            output += `<td width="200px"><ins>${entry.name}</ins></td>`;
                            output += `<td width="700px">${entry.level}</td>`;
                            output += '</tr>';
                        }
                        
                        // Skills
                        else if (!entry.hasOwnProperty('range') && entry.hasOwnProperty('activities')) {
                            // Entry content | start
                            output += '<tr>';
                            output += `<td width="200px" valign="top"><strong>${entry.domain}</strong></td>`;
                            output += '<td width="700px" valign="top">';

                            // Activities
                            if (entry.activities.length > 0) {
                                output += '<br>';
                                output += '<ul>';
                                entry.activities.forEach((activity) => {
                                    output += `<li><ins>${activity.name}:</ins>&nbsp;${activity.description}</li>`;
                                });
                                output += '</ul>';
                                output += '<br>';
                            }

                            // Entry content | end
                            output += '</td>';
                            output += '</tr>';
                        }

                        // Interests
                        else {
                            // Entry content
                            output += '<tr>';
                            output += `<td width="900px">&bull;&nbsp;&nbsp;${entry.name}</td>`;
                            output += '</tr>';
                        }
                    });
                }

                // Section content | end
                output += '</tbody>';
                output += '</table>';
                output += `<br>\n`;
            });
        }
    }

    // End of HTML string
    output += '</body></html>';

    // Return generated string
    return output;
}

// Main
init_rendering();
