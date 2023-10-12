const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

//fix cors
app.use(cors());

// Połączenie z bazą danych MongoDB
mongoose.connect('mongodb://localhost/page_views_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const PageViewSchema = new mongoose.Schema({
    page: String,
    views: Number,
});

const PageView = mongoose.model('PageView', PageViewSchema);

// Obsługa zliczania odsłon strony
app.get('/page/:pageName', async (req, res) => {
    const { pageName } = req.params;

    // Sprawdzenie, czy strona istnieje w bazie danych
    let pageView = await PageView.findOne({ page: pageName });

    if (!pageView) {
        pageView = new PageView({ page: pageName, views: 1 });
    } else {
        pageView.views += 1;
    }

    // Zapisanie zmian w bazie danych
    await pageView.save();

    res.json({ page: pageName, views: pageView.views });
});


// Endpoint do wyświetlenia wszystkich odsłon
app.get('/page-views', async (req, res) => {
    try {
        const allPageViews = await PageView.find();
        res.json(allPageViews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd podczas pobierania odsłon' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});