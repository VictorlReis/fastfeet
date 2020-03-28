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
      subject: 'Order canceled',
      text: 'You order has been sucessfully canceled.',
    });
  }
}

export default new CancellationMail();
