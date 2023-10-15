import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMsg = 'No receipe found for your query!!!!!!!';
  _msg = '';

  _generateMarkup() {
    //console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();
