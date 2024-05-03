const { users } = require("../model/user");
const cloudinary = require("../utils/cloudinary");
const path = require('path');
const canvasToBuffer = require('canvas-to-buffer');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fetch = require('node-fetch');
const axios = require('axios');

exports.User = async (req, res) => {
    try {
        const { name, dob } = req.body;
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "automation_poster"
        });
        const dobDate  = new Date(dob);
        const user = new users({
            name,
            dob: dobDate,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url
            }
        });
        await user.save();
        const canvas = await createPosterCanvas(name, dob, result.secure_url);
        const canvasImage = canvas.toBuffer("image/jpeg");
        await sendWhatsAppMessage(name, '919106253017', canvasImage);
        return res.status(200).json({success: true, message: "Data added successfully", data: user});
    } catch (error) {
        return res.status(400).json({success: false, message: error})
    }
}

async function sendWhatsAppMessage(name, phoneNumber, canvas) {
    try {
        const authToken = 'U2FsdGVkX1/ug0OBB0k7o4i/C2fLQsC26whfAOfewPWDHATb0kdL+QElsbtYMiNQVH8PdYc3PpS+TG4P6S6dMACPuoX49vhOnirOfCPMtNy7//x+w9Jk8boA4nOCzTpfar6mPF/wExPqByo7EdjoF+UWqZrCB6iIYd2PRjIU1t1z3WNyUAhSk1t/zKMRvVgU';
        const sendTo = phoneNumber; // Replace with the recipient's WhatsApp number
        const originWebsite = 'https://myinvented.com/';
        const templateName = 'poster';
        const language = 'en';

        // Create a Blob from the Buffer
        const blob = new Blob([canvas], { type: 'image/jpeg' });

        // Create form data
        const formData = new FormData();
        formData.append('authToken', authToken);
        formData.append('name', `test_${name}`);
        formData.append('sendto', sendTo);
        formData.append('originWebsite', originWebsite);
        formData.append('templateName', templateName);
        formData.append('language', language);
        formData.append('myfile', blob, 'canvas_image.jpeg');
        console.log('formData', formData);
        // Make POST request to the API endpoint
        const response = await axios.post('https://app.11za.in/apis/template/sendTemplate', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });


        console.log('WhatsApp message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error.message);
    }
}


async function createPosterCanvas(name, dob, user) {
    const canvas = createCanvas(600, 800);
    const ctx = canvas.getContext('2d');

    try {
        // Fetch poster image
        const posterImagePath = 'https://res.cloudinary.com/dbb3q0p82/image/upload/v1714649755/automation_poster/cqtwxp8ncwiii2skb1a4.jpg';
        const response = await fetch(posterImagePath);
        const buffer = await response.buffer();

        // Load image from buffer
        const posterImage = await loadImage(buffer);

        ctx.drawImage(posterImage, 0, 0, canvas.width, canvas.height);

        // Register font
        const fontPath = path.resolve(__dirname, '../Poppins-Bold.ttf');
        registerFont(fontPath, { family: 'Poppins' });

        // Set text style
        ctx.font = 'bold 36px Poppins';
        ctx.fillStyle = '#aa634f';

        // Calculate text width to center it
        const nameWidth = ctx.measureText(name).width;
        const nameX = (canvas.width - nameWidth) / 2;

        const dobWidth = ctx.measureText(dob).width;
        const dobX = (canvas.width - dobWidth) / 2;

        // Draw user name
        ctx.fillText(name, nameX, 500);

        // Draw user dob
        ctx.fillText(dob, dobX, 200);

        // Load avatar image
        const avatarImagePath = user; // Assuming user.avatar.url contains the URL of the avatar image
        const avatarResponse = await fetch(avatarImagePath);
        const avatarBuffer = await avatarResponse.buffer();
        const avatarImage = await loadImage(avatarBuffer);

        // Draw avatar image
        ctx.drawImage(avatarImage, 187, 227, 220, 220); // Adjust position and size as needed

        return canvas;
    } catch (error) {
        console.error('Error creating poster canvas:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}
