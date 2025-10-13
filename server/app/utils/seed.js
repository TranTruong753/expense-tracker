import categoriesController from '../controllers/categoriesController.js';

async function initializeData() {
    try {
        console.log('Initializing application data...');
        await categoriesController.seedData(); // hoặc seedDataAdvanced()
        console.log('Data initialization completed!');
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

export default initializeData;