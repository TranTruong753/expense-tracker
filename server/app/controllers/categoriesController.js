import Category  from "../models/categories.js";

const categories = [
  // EXPENSE
  { name: "Ăn uống", type: "EXPENSE", icon: "🍔", isDefault: true },
  { name: "Di chuyển", type: "EXPENSE", icon: "🚌", isDefault: true },
  { name: "Nhà ở", type: "EXPENSE", icon: "🏠", isDefault: true },
  { name: "Tiện ích", type: "EXPENSE", icon: "💡", isDefault: true },
  { name: "Mua sắm", type: "EXPENSE", icon: "🛍️", isDefault: true },
  { name: "Giải trí", type: "EXPENSE", icon: "🎮", isDefault: true },
  { name: "Sức khỏe", type: "EXPENSE", icon: "💊", isDefault: true },
  { name: "Giáo dục", type: "EXPENSE", icon: "📚", isDefault: true },
  { name: "Du lịch", type: "EXPENSE", icon: "✈️", isDefault: true },
  { name: "Khác", type: "EXPENSE", icon: "💸", isDefault: true },

  // INCOME
  { name: "Lương", type: "INCOME", icon: "💼", isDefault: true },
  { name: "Thưởng", type: "INCOME", icon: "🎁", isDefault: true },
  { name: "Kinh doanh", type: "INCOME", icon: "💰", isDefault: true },
  { name: "Đầu tư", type: "INCOME", icon: "📈", isDefault: true },
  { name: "Trợ cấp", type: "INCOME", icon: "🤝", isDefault: true },
  { name: "Tiền lãi", type: "INCOME", icon: "🏦", isDefault: true },
  { name: "Bán tài sản", type: "INCOME", icon: "🏠", isDefault: true },
  { name: "Khác", type: "INCOME", icon: "💵", isDefault: true }
];

class categoriesController {

    async seedData(){
       return await Category.insertMany(categories);
    }

    // [POST] /categories/create
    async create(req, res, next) {
        try {
            console.log('BODY:', req.body);
            const formData = req.body;
            const newCategories = new Category(formData);
            await newCategories.save();
            res.status(201).json(newCategories);

        } catch (error) {
            next(error);
        }
    }

    // [GET] /categories
    async getAll(req, res, next) {
        try {
            const data = await Category.find(); 
             return res.json({
                success: true,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new categoriesController()