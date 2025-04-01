import PDFDocument from 'pdfkit';
import fs from 'fs';

// Create a new PDF document
const doc = new PDFDocument();

// Pipe the PDF to a file
doc.pipe(fs.createWriteStream('setup-instructions.pdf'));

// Add title
doc.fontSize(24)
   .font('Helvetica-Bold')
   .text('Dog Adoption Application Setup Instructions', {
     align: 'center'
   });

doc.moveDown(2);

// Add prerequisites section
doc.fontSize(16)
   .font('Helvetica-Bold')
   .text('Prerequisites:');

doc.fontSize(12)
   .font('Helvetica')
   .moveDown(0.5)
   .list([
     'Node.js (version 18 or higher) must be installed',
     'npm (Node Package Manager, comes with Node.js)',
   ]);

doc.moveDown(2);

// Add setup instructions section
doc.fontSize(16)
   .font('Helvetica-Bold')
   .text('Setup Instructions:');

doc.fontSize(12)
   .font('Helvetica')
   .moveDown(0.5)
   .text('1. Clone or download the project files to your computer')
   .moveDown(0.5)
   .text('2. Open terminal/command prompt and navigate to the project directory:')
   .moveDown(0.5)
   .font('Courier')
   .text('   cd path/to/project')
   .moveDown(0.5)
   .font('Helvetica')
   .text('3. Install dependencies:')
   .moveDown(0.5)
   .font('Courier')
   .text('   npm install')
   .moveDown(0.5)
   .font('Helvetica')
   .text('4. Start the development server:')
   .moveDown(0.5)
   .font('Courier')
   .text('   npm run dev');

doc.moveDown(2);

// Add important notes section
doc.fontSize(16)
   .font('Helvetica-Bold')
   .text('Important Notes:');

doc.fontSize(12)
   .font('Helvetica')
   .moveDown(0.5)
   .list([
     'The application will run on http://localhost:5173 by default',
     'The application requires an internet connection to communicate with the Fetch API service',
     'Make sure no other application is using port 5173',
     'The application works best in modern browsers (Chrome, Firefox, Safari, Edge)',
   ]);

// Finalize the PDF
doc.end();