require 'rails_helper'

RSpec.describe Category, type: :model do
  it "is valid with a unique name" do
    category = Category.new(name: "Groceries")
    expect(category).to be_valid
  end

  it "is invalid without a name" do
    category = Category.new(name: nil)
    expect(category).not_to be_valid
    expect(category.errors[:name]).to include("can't be blank")
  end

  it "is invalid with a blank name" do
    category = Category.new(name: "")
    expect(category).not_to be_valid
  end

  it "is invalid with a duplicate name" do
    Category.create!(name: "Food")
    duplicate = Category.new(name: "Food")
    expect(duplicate).not_to be_valid
    expect(duplicate.errors[:name]).to include("has already been taken")
  end
end
