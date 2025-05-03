function generateOtp() {
    const otp=Math.floor(100000 + Math.random()*90000);
    return otp.toString().substring(0,6);
};

export default generateOtp;