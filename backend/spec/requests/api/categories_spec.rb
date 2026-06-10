require 'rails_helper'

RSpec.describe "Api::Categories", type: :request do
  describe "GET /api/categories" do
    let!(:food) { Category.create!(name: "Food") }
    let!(:transport) { Category.create!(name: "Transport") }
    let!(:supplies) { Category.create!(name: "Supplies") }

    it "returns all categories" do
      get "/api/categories"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
      expect(json.map { |c| c["name"] }).to include("Food", "Transport", "Supplies")
    end

    it "returns categories in alphabetical order" do
      get "/api/categories"

      json = JSON.parse(response.body)
      expect(json.map { |c| c["name"] }).to eq([ "Food", "Supplies", "Transport" ])
    end
  end

  describe "POST /api/categories" do
    context "with valid parameters" do
      it "creates a new category and returns 201" do
        expect {
          post "/api/categories", params: { category: { name: "Groceries" } }, as: :json
        }.to change(Category, :count).by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["name"]).to eq("Groceries")
        expect(json["id"]).to be_present
      end
    end

    context "with invalid parameters" do
      it "returns 422 for a duplicate name" do
        Category.create!(name: "Food")

        expect {
          post "/api/categories", params: { category: { name: "Food" } }, as: :json
        }.not_to change(Category, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to be_present
      end

      it "returns 422 for a blank name" do
        expect {
          post "/api/categories", params: { category: { name: "" } }, as: :json
        }.not_to change(Category, :count)

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PATCH /api/categories/:id" do
    let!(:category) { Category.create!(name: "Food") }

    it "updates the category name and returns 200" do
      patch "/api/categories/#{category.id}", params: { category: { name: "Groceries" } }, as: :json

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["name"]).to eq("Groceries")
      expect(category.reload.name).to eq("Groceries")
    end

    it "returns 422 for a duplicate name" do
      Category.create!(name: "Transport")

      patch "/api/categories/#{category.id}", params: { category: { name: "Transport" } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json["errors"]).to be_present
    end

    it "returns 422 for a blank name" do
      patch "/api/categories/#{category.id}", params: { category: { name: "" } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "DELETE /api/categories/:id" do
    let!(:category) { Category.create!(name: "Food") }

    it "destroys the category and returns 204" do
      expect {
        delete "/api/categories/#{category.id}"
      }.to change(Category, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end
