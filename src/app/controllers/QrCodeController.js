import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import QrCodeModel from '../models/QrCode'
import User from '../models/User'

class QrCodeController {

  async create (req, res){

    const {user_id} = req.params;
    const {otpauth_url} = await speakeasy.generateSecret({hash:process.env.SECRET_QRCODE});
    console.log(otpauth_url)
    const user = await User.findOne({
      where: { id: user_id},
    });

    if(!user){
      return res.status(400).json({ error: "User not exist" });
    }

    const qrcodedata = [
      `${process.env.URLQRCODE}validator?user=${user_id}&secret=${otpauth_url}`,
    ]

    const generateQR = await qrcode.toDataURL(qrcodedata)

    const result = await QrCodeModel.create({
      user_id,
      secret:otpauth_url,
      qrcode: generateQR,
    });

    return res.status(200).json(result);
  }

  async index(req, res) {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id, {
      include: { association: 'qrcodes' }
    });

    return res.json(user.qrcodes);
  }

  async delete(req, res) {
    const { user_id } = req.params;
    const { id } = req.params;

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const qrcode = await QrCodeModel.findOne({
      where: { id }
    });

    await user.removeQrcode(qrcode);
    await qrcode.destroy();

    return res.json();
  }

  async validateQrcode(req, res){
    const { user_id, secret } = req.params

    var tokenValidates = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      user_id,
    });
    console.log(tokenValidates);
  }

}

export default new QrCodeController();
