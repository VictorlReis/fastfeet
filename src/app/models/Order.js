import Sequelize, { Model } from 'sequelize';
import { isBefore } from 'date-fns';

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'deliveryman_id',
    });
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
    });
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
    });
  }
}
export default Order;
