import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login';
import RegisterPage from '../pages/register/register';
import StoriesPage from '../pages/stories/stories-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import Dashboard from '../pages/dashboard/dashboard';
import FavoritesPage from '../pages/favorites/favorites-page';
import DetailPage from '../pages/stories/detail-page';
import NotFoundPage from '../pages/not-found/not-found-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/stories': new StoriesPage(),
  '/stories/:id': new DetailPage(),
  '/add-story': new AddStoryPage(),
  '/dashboard': Dashboard,
  '/favorites': new FavoritesPage(),
  // Wildcard route for 404
  '*': new NotFoundPage(),
};


export default routes;
