import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { order } = data;
    console.log('ok: true');
    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: 'Order created',
      text: 'You order has been sucessfully created.',
    });
  }
}

export default new CancellationMail();
