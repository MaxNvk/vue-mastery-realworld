import EventService from '@/services/EventService.js';

export const namespaced = true;

export const state = {
  todos: [
    { id: 1, text: '...', done: true },
    { id: 2, text: '...', done: false },
    { id: 3, text: '...', done: true },
    { id: 4, text: '...', done: false }
  ],
  events: [],
  eventsTotal: null,
  event: {}
};

export const mutations = {
  ADD_EVENT(state, event) {
    state.events.push(event);
  },
  SET_EVENTS(state, events) {
    state.events = events;
  },
  SET_EVENTS_TOTAL(state, eventsTotal) {
    state.eventsTotal = eventsTotal;
  },
  SET_EVENT(state, event) {
    state.event = event;
  }
}

export const actions = {
  createEvent({ commit, dispatch }, event) {
    return EventService.postEvent(event).then(() => {
      commit('ADD_EVENT', event);

      const notification = {
        type: 'success',
        message: 'Your event has been created!'
      };

      dispatch('notification/add', notification, { root: true });
    }).catch(error => {
      const notification = {
        type: 'error',
        message: `There is a problem creating your event: ${error.message}`
      };

      dispatch('notification/add', notification, { root: true });
      throw error
    });
  },
  fetchEvents({ commit, dispatch }, { perPage, page }) {
    EventService.getEvents(perPage, page)
      .then(response => {
        commit('SET_EVENTS_TOTAL', response.headers['x-total-count']);
        commit('SET_EVENTS', response.data);

        const notification = {
          type: 'success',
          message: `Total events are ${response.headers['x-total-count']}`
        };
        
        dispatch('notification/add', notification, { root: true });
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: `There was a problem fetching events: ${error.message}`
        };
        
        dispatch('notification/add', notification, { root: true });
      });
  },
  fetchEvent({ commit, getters }, id) {
    let event = getters.getEventById(id);
    if( event ) {
      commit('SET_EVENT', event);
    } else {
      EventService.getEvent(id)
        .then(response => {
          commit('SET_EVENT', response.data);
        })
        .catch(error => {
          console.log('There was an error:', error.response)
        });
    }
  }
}

export const getters = {
  catLength: state => {
    return state.categories.length
  },
  doneTodos: state => {
    return state.todos.filter(todo => todo.done)
  },
  activeTodosCount: (state, getters) => {
    return state.todos.length - getters.doneTodos.length
  },
  getToDoById: state => id => {
    return state.todos.find(event => event.id === id)
  },
  getEventById: state => id => {
    return state.events.find(event => event.id === id);
  }
}