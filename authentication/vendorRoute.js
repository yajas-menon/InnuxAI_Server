
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor')
const crypto = require('crypto');



router.post('/vendors', async (req, res) => {
    const { vendorName, companyName, email, industry } = req.body;
  
    try {
      const newVendor = new Vendor({
        vendorName,
        companyName,
        email,
        industry,
      });
  
      const savedVendor = await newVendor.save();
      res.status(201).json(savedVendor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/getallvendors', async (req, res) => {
    try {
      const vendors = await Vendor.find({});
      res.status(200).json(vendors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.post("/vendorlogin", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the vendor exists
      const vendor = await Vendor.findOne({ email });
  
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
  
      // Validate password
      const isPasswordValid = await bcrypt.compare(password, vendor.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Create JWT token
      const token = jwt.sign(
        { userId: vendor._id, role: "Vendor" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({ user: vendor, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });


  router.get('/get_vendors', async (req, res) => {
    try {
      const vendors = await Vendor.find({}, 'vendorName email'); // Fetch vendorName and email only
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching vendors', error });
    }
  });
  

//   router.patch('/acceptvendors/:id/accept', async (req, res) => {
//     try {
//       const vendor = await Vendor.findByIdAndUpdate(
//         req.params.id,
//         { status: 'Accepted' },
//         { new: true }
        
//       );
//       if (!vendor) {
//         return res.status(404).json({ message: 'Vendor not found' });
//       }
//       res.status(200).json(vendor);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
  
const transporter = nodemailer.createTransport({
    service:"gmail",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const sendEmail = (email, password) => {
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Vendor Access Granted',
      text: `Your account has been approved. Here are your login details:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease log in and change your password immediately.`,
    };
  
    return transporter.sendMail(mailOptions);
  };

  const generatePassword = () => {
    return crypto.randomBytes(8).toString('hex');
  };

  
  router.post('/send-email', async (req, res) => {
    const { content, recipientEmail } = req.body;
  
    // Basic validation
    if (!content || !recipientEmail) {
      return res.status(400).json({ message: 'Content and recipient email are required.' });
    }
  
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email address
      to: recipientEmail, // Recipient email address
      subject: 'Document from Vendor Portal', // Subject of the email
      html: content, // HTML content (the document)
    };
  
    try {
      // Send the email using nodemailer
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send email.', error });
    }
  });


  router.patch('/acceptvendors/:id/accept', async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.params.id);
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
  
      // Generate a new password
      const password = generatePassword();
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update vendor status and password
      vendor.status = 'Accepted';
      vendor.password = hashedPassword;
      await vendor.save();
  
      // Send email to the vendor with the new password
      await sendEmail(vendor.email, password);
  
      res.status(200).json(vendor);
    } catch (error) {
      console.error('Error updating vendor status:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
 

  
  // Route to update vendor status to Rejected
  router.patch('/rejectvendors/:id/reject', async (req, res) => {
    try {
      const vendor = await Vendor.findByIdAndUpdate(
        req.params.id,
        { status: 'Rejected' },
        { new: true }
      );
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
      res.status(200).json(vendor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;