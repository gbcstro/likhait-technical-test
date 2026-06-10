class AddDateToExpenses < ActiveRecord::Migration[7.2]
  def change
    unless column_exists?(:expenses, :date)
      add_column :expenses, :date, :date, null: true
    end

    if column_exists?(:expenses, :payer_name)
      change_column_null :expenses, :payer_name, true
    end
  end
end
