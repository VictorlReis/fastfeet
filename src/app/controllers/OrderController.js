/* eslint-disable camelcase */
import * as Yup from 'yup';
import Order from '../models/Order';
import User from '../models/User';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
      start_date: Yup.date().required(),
      end_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      product,
      canceled_at,
      start_date,
      end_date,
      deliveryman_id,
    } = req.body;

    const isDeliveryman = await User.findOne({
      where: { id: deliveryman_id, administrator: false },
    });

    if (!isDeliveryman) {
      return res
        .status(401)
        .json({ error: 'You only create orders with deliverymen' });
    }

    const order = await Order.create({
      product,
      canceled_at,
      start_date,
      end_date,
      deliveryman_id: req.userId,
    });

    return res.json(order);
  }
}
export default new OrderController();
