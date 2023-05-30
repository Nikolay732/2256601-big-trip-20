import EditFormView from '../view/edit-form-view.js';
import ListView from '../view/list-view.js';
import RoutePointView from '../view/route-point-view.js';
import { render, replace } from '../framework/render.js';
import { isEscapeKey } from '../utils.js';
export default class BoardPresenter {
  #listComponent = new ListView();
  #boardContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #points = [];

  constructor({boardContainer, destinationsModel, offersModel, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.points];
  }

  init() {
    render(this.#listComponent, this.#boardContainer);
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint (point) {
    const pointComponent = new RoutePointView ({
      point,
      pointDestinations: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onEditClick: pointEditClickHandler
    });

    const pointEditComponent = new EditFormView ({
      point,
      pointDestinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,
      onCloseClick: CloseButtonClickHandler,
      onFormSubmit: pointSubmitHandler
    });

    const escKeyDownHandler = (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    function pointEditClickHandler () {
      replacePointToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function CloseButtonClickHandler () {
      replaceFormToPoint ();
      document.removeEventListener('keydown', escKeyDownHandler);
    }
    function pointSubmitHandler () {
      replaceFormToPoint ();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    function replaceFormToPoint () {
      replace(pointComponent, pointEditComponent);
    }

    function replacePointToForm () {
      replace (pointEditComponent, pointComponent);
    }

    render(pointComponent, this.#listComponent.element);
  }
}