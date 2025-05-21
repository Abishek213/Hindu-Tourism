import jsPDF from 'jspdf';

export const generateBookingPDF = async (booking) => {
  // Initialize PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4',
  });

  // Set initial position
  let y = 40;
  
  // Function to create header (for first page and subsequent pages)
  const createHeader = () => {
    // Add company logo from public folder
    try {
      const logoWidth = 100;
      const logoHeight = 40;
      doc.addImage('/logo.jpg', 'JPEG', 40, y, logoWidth, logoHeight);
    } catch (error) {
      console.error("Error adding logo:", error);
    }
  
    // Title with saffron color
    doc.setTextColor(255, 153, 51); // Saffron color (RGB)
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('Booking Confirmation', 170, y + 25);
    
    // Reset text color to black for the rest of the document
    doc.setTextColor(0, 0, 0);
    y += 80;
  };
  
  // Create header on first page
  createHeader();
  
  // Helper function to create section headers
  const addSectionHeader = (title) => {
    // Check if we need a new page
    if (y > 750) {
      doc.addPage();
      y = 40;
      createHeader();
    }
    
    doc.setFillColor(240, 240, 240);
    doc.rect(40, y - 15, 520, 20, 'F');
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(title, 50, y);
    y += 20;
  };
  
  // Helper function to add text fields
  const addText = (label, value) => {
    // Check if we need a new page
    if (y > 780) {
      doc.addPage();
      y = 40;
      createHeader();
    }
    
    // Handle long text values by potentially wrapping them
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`${label}:`, 50, y);
    
    doc.setFont(undefined, 'normal');
    
    // Handle long text with text wrapping
    const valueStr = String(value || 'N/A');
    const maxWidth = 320;
    
    if (doc.getStringUnitWidth(valueStr) * 12 > maxWidth) {
      const splitText = doc.splitTextToSize(valueStr, maxWidth);
      doc.text(splitText, 200, y);
      y += (splitText.length * 16);  // Adjust y position based on number of lines
    } else {
      doc.text(valueStr, 200, y);
      y += 16;
    }
  };
  
  // SECTION 1: Booking Details
  addSectionHeader('Booking Information');
  addText("Lead ID", booking.leadId);
  addText("Booking ID", booking.id);
  addText("Created At", new Date(booking.createdAt).toLocaleString());
  addText("Email", booking.email || booking.emailAddress || 'N/A');
  addText("Contact Number", booking.contactNumber || 'N/A');
  y += 10;
  
  // SECTION 2: Trip Details
  addSectionHeader('Trip Details');
  addText("Package", booking.package);
  addText("Destination", booking.destination || 'N/A');
  addText("Travel Dates", `${formatDate(booking.startDate)} to ${formatDate(booking.endDate)}`);
  addText("Number of Travelers", booking.travelers);
  addText("Advance Amount", booking.advanceAmount ? `₹${booking.advanceAmount}` : 'N/A');
  y += 10;
  
  // SECTION 3: Services
  addSectionHeader('Services & Accommodations');
  addText("Guide", booking.guide || 'Not assigned');
  addText("Transport Team", booking.transportTeam || 'Not assigned');
  addText("Helicopter", booking.helicopter ? "Yes" : "No");
  addText("Hotel Upgrade", booking.hotelUpgrade ? "Yes" : "No");
  addText("Nurse Support", booking.nurseSupport ? "Yes" : "No");
  y += 10;
  
  // SECTION 4: Travelers Information
  if (booking.travelersInfo && booking.travelersInfo.length > 0) {
    addSectionHeader('Travelers Information');
    
    booking.travelersInfo.forEach((traveler, index) => {
      // Check if we need a new page for this traveler
      if (y > 700) {
        doc.addPage();
        y = 40;
        createHeader();
      }
      
      // Add traveler header
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.text(`${index === 0 ? 'Lead Traveler' : `Traveler ${index + 1}`}: ${traveler.name || 'N/A'}`, 50, y);
      y += 20;
      
      // Process traveler documents
      if (traveler.documents) {
        processTravelerDocuments(traveler.documents, index);
      }
      
      y += 10; // Add space after each traveler
    });
  }
  
  // Helper to format dates
  function formatDate(dateString) {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  }
  
  // Helper function to process traveler documents
  function processTravelerDocuments(documents, travelerIndex) {
    const processDocument = async (label, fileObj) => {
      if (!fileObj?.dataUrl) return;
      
      // Calculate space needed
      let imgHeight = 150; // Default height
      let imgWidth = 200; // Default width
      
      // If it's an image, get actual dimensions
      if (fileObj.type?.startsWith("image/")) {
        try {
          const imageProps = doc.getImageProperties(fileObj.dataUrl);
          const maxWidth = 200;
          const aspectRatio = imageProps.width / imageProps.height;
          imgWidth = maxWidth;
          imgHeight = maxWidth / aspectRatio;
        } catch (e) {
          console.error("Error getting image properties:", e);
        }
      }
      
      // Check if we need a new page
      if (y + imgHeight + 40 > 780) {
        doc.addPage();
        y = 40;
        createHeader();
      }
      
      // Add document label
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${label}:`, 50, y);
      y += 20;
      
      // Add the image if it's an image type
      if (fileObj.type?.startsWith("image/")) {
        try {
          doc.addImage(
            fileObj.dataUrl, 
            fileObj.type.includes("png") ? "PNG" : "JPEG", 
            50, y, imgWidth, imgHeight
          );
          y += imgHeight + 20;
        } catch (e) {
          console.error(`Error adding ${label} image:`, e);
          // Add fallback text if image fails
          doc.setFont(undefined, 'normal');
          doc.text(`[Document available but cannot be displayed]`, 50, y);
          y += 20;
        }
      } else {
        // For non-image files, just mention it's attached
        doc.setFont(undefined, 'normal');
        doc.text(`[Document attached: ${fileObj.name || 'Unnamed file'}]`, 50, y);
        y += 20;
      }
    };
    
    // Process all document types
    if (documents.passportFile) {
      processDocument("Passport", documents.passportFile);
    }
    
    if (documents.aadhaarFrontFile) {
      processDocument("Aadhaar Card (Front)", documents.aadhaarFrontFile);
    }
    
    if (documents.aadhaarBackFile) {
      processDocument("Aadhaar Card (Back)", documents.aadhaarBackFile);
    }
  }
  
  // Add footer with page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    // Add footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(40, 800, 560, 800);
    
    // Add page numbers
    doc.text(`Page ${i} of ${pageCount}`, 280, 815);
    
    // Add company info in footer if needed
    doc.text('© ' + new Date().getFullYear() + ' Your Company Name', 40, 815);
  }
  
  // Output
  const dataUrl = doc.output('dataurlstring');
  
  return {
    filename: `booking-${booking.leadId}.pdf`,
    dataUrl,
  };
};