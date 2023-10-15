import { async } from 'regenerator-runtime';

import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    //0)Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //1) updating bookmarks
    bookmarksView.update(model.state.bookmarks);

    if (!id) return;
    recipeView.renderSpinner();

    //2)Loading recipe
    await model.loadRecipe(id);

    //3) rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    //1)Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2)Load search results
    await model.loadSearchResults(query);

    //3)Render result
    //resultsView.render(model.state.search.result);
    resultsView.render(model.getSearchResultsPage());

    //4)Render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1)Render NEW result
  resultsView.render(model.getSearchResultsPage(goToPage));
  //2)Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings(in state)
  model.updateServings(newServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  //3) render bokkmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show spinner
    addRecipeView.renderSpinner();

    //Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render bookmarks
    bookmarksView.render(model.state.bookmarks);

    //Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Sucess Message
    addRecipeView.renderMsg();

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 2.5 * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandleRender(controlRecipes);
  recipeView.addHandleUpdateServings(controlServings);
  recipeView.addHandleAddBookmark(controlAddBookmark);
  searchView.addSearchHandler(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
