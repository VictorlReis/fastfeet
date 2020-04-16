/* eslint-disable camelcase */
import * as Yup from 'yup';
import { startOfHour, parseISO } from 'date-fns';
import Order from '../models/Order';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';
import CreationMail from '../jobs/CreationMail';

class OrderController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const orders = await Order.findAll({
      where: { deliveryman_id: req.userId, canceled_at: null },
      order: ['created_at'],
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
          include: [
            { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
          ],
        },
      ],
      attributes: [
        'id',
        'product',
        'past',
        'canceled_at',
        'start_date',
        'end_date',
        'deliveryman_id',
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      recipient_id: Yup.number().required(),
      product: Yup.string().required(),
      start_date: Yup.date().required(),
      end_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      deliveryman_id,
      recipient_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = req.body;

    //    const isAdministrator = await User.findOne({
    //      where: { id: req.userId, administrator: true },
    //    });

    //    if (!isAdministrator) {
    //      return res
    //        .status(401)
    //        .json({ error: "You don't have permission to create an order" });
    //    }

    const startDateHour = startOfHour(parseISO(start_date));

    const checkAvailability = await Order.findOne({
      where: {
        deliveryman_id,
        canceled_at: null,
        start_date: startDateHour,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Order date is not available' });
    }

    const order = await Order.create({
      product,
      canceled_at,
      start_date,
      end_date,
      deliveryman_id: req.userId,
      recipient_id,
    });

    await Queue.add(CreationMail.key, { order });

    const user = await User.findByPk(req.userId);

    await Notification.create({
      content: `New notification for ${user.name} at ${start_date}`,
      user: req.userId,
    });

    return res.json(order);
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'deliveryman', attributes: ['name', 'email'] },
      ],
    });

    if (order.deliveryman_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "You don't have permission to cancel this order" });
    }

    const isDeliveryman = await User.findByPk(req.userId);

    if (isDeliveryman.administrator) {
      return res
        .status(401)
        .json({ error: 'Only deliverymen can delete an order' });
    }

    order.canceled_at = new Date();

    await order.save();

    await Queue.add(CancellationMail.key, { order });

    return res.json(order);
  }
}
export default new OrderController();
