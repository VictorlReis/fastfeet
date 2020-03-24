/* eslint-disable camelcase */
import * as Yup from 'yup';
import Recipient from '../models/Recipient';
import User from '../models/User';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      state: Yup.string().required(),
      zip_code: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const isAdministrator = await User.findOne({
      where: { id: req.userId, administrator: true },
    });

    if (!isAdministrator) {
      return res
        .status(401)
        .json({ error: "You don't have permission to create a recipient" });
    }

    const recipientExists = await Recipient.findOne({
      where: { name: req.body.name },
    });
    if (recipientExists)
      return res.status(400).json({ error: 'Recipient already exists!' });

    const { id, name } = await Recipient.create(req.body);
    return res.json({ id, name });
  }

  async update(req, res) {
    const { id: recipientId } = req.params;

    const recipient = await Recipient.findByPk(recipientId);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found.' });
    }

    const isAdministrator = await User.findOne({
      where: { id: req.userId, administrator: true },
    });

    if (!isAdministrator) {
      return res
        .status(401)
        .json({ error: "You don't have permission to update a recipient" });
    }

    await recipient.update(req.body);

    return res.json(recipient);
  }
}

export default new RecipientController();
