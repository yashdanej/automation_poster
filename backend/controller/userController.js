const { users } = require("../model/user");
const cloudinary = require("../utils/cloudinary");

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
        return res.status(200).json({success: true, message: "Data added successfully", data: user});
    } catch (error) {
        return res.status(400).json({success: false, message: error})
    }
}