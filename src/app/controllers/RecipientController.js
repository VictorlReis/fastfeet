import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object.shape({
      name: Yup.string().required,
      street: Yup.string().required(),
      number: Yup.number()
        .required()
        .max(5)
        .positive(),
      state: Yup.string().required(),
      zip_code: Yup.string().matches(
        /^[0-9]{5}(?:-[0-9]{4})?$/,
        'Must be 5 or 9 digits'
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, name } = await Recipient.create(req.body);
    return res.json({ id, name });
  }
}

export default new RecipientController();
