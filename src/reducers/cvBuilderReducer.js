import get from 'lodash/get'
import set from 'lodash/set'
import remove from 'lodash/remove'
import * as ACTIONS from '../actions/types'
import demoJsonldData from '../assets/demo/jsonlddata.json'
import { move } from '../components/Utilities'

const initialState = {
  data: {
    jsonld: {
      '@context': [
        'https://jsonldresume.github.io/skill/context.json',
        {
          gender: {
            '@id': 'schema:gender',
            '@type': '@vocab',
          },
          'skill:classOfAward': {
            '@id': 'skill:classOfAward',
            '@type': '@vocab',
          },
          'skill:securityClearance': {
            '@id': 'skill:securityClearance',
            '@type': '@vocab',
          },
          category: {
            '@id': 'schema:category',
            '@type': '@vocab',
          },
          dayOfWeek: {
            '@id': 'schema:dayOfWeek',
            '@type': '@vocab',
          },
        },
      ],
      '@graph': [
        {
          '@type': 'skill:Resume',
        },
        {
          '@type': 'Person',
          givenName: [{ '@language': 'en', '@value': '' }],
          familyName: [{ '@language': 'en', '@value': '' }],
          address: [],
        },
      ],
    },
    profile: {
      heading: 'Profile',
      photo: '',
      firstName: '',
      lastName: '',
      subtitle: '',
      address: {
        line1: '',
        line2: '',
        line3: '',
      },
      phone: '',
      website: '',
      email: '',
    },
    contacts: {
      enable: true,
      heading: 'Contacts',
    },
    address: {
      enable: true,
      heading: 'Address',
    },
    objective: {
      enable: true,
      heading: 'Objective',
      body: '',
    },
    work: {
      enable: true,
      heading: 'Work Experience',
      items: [],
    },
    education: {
      enable: true,
      heading: 'Education',
      items: [],
    },
    awards: {
      enable: true,
      heading: 'Honors & Awards',
      items: [],
    },
    certifications: {
      enable: true,
      heading: 'Certifications',
      items: [],
    },
    skills: {
      enable: true,
      heading: 'Skills',
      items: [],
    },
    memberships: {
      enable: true,
      heading: 'Memberships',
      items: [],
    },
    languages: {
      enable: true,
      heading: 'Languages',
      items: [],
    },
    references: {
      enable: true,
      heading: 'References',
      items: [],
    },
    extras: {
      enable: true,
      heading: 'Personal Information',
      items: [],
    },
  },
  theme: {
    layout: 'Onyx',
    font: {
      family: '',
    },
    colors: {
      background: '#ffffff',
      primary: '#212121',
      accent: '#f44336',
    },
    layoutblocks: {
      onyx: [
        ['objective', 'work', 'education', 'projects'],
        ['hobbies', 'languages', 'awards', 'certifications'],
        ['skills', 'references'],
      ],
      pikachu: [
        ['skills', 'languages', 'hobbies', 'awards', 'certifications'],
        ['work', 'education', 'projects', 'references'],
      ],
      gengar: [
        ['objective', 'skills'],
        ['awards', 'certifications', 'languages', 'references', 'hobbies'],
        ['work', 'education', 'projects'],
      ],
      castform: [
        ['awards', 'certifications', 'languages', 'hobbies'],
        ['objective', 'work', 'education', 'skills', 'projects', 'references'],
      ],
      glalie: [
        ['awards', 'certifications', 'hobbies'],
        [
          'objective',
          'work',
          'education',
          'skills',
          'projects',
          'languages',
          'references',
        ],
      ],
      celebi: [
        ['awards', 'certifications', 'languages', 'hobbies'],
        ['objective', 'work', 'education', 'skills', 'projects', 'references'],
      ],
    },
  },
  settings: {
    language: 'en',
  },
}

export const cvBuilderReducer = (state = initialState, action) => {
  let items

  switch (action.type) {
    case ACTIONS.MIGRATE_SECTION:
      return set(
        { ...state },
        `data.${action.payload.key}`,
        action.payload.value,
      )
    case ACTIONS.ADD_ITEM:
      items = get({ ...state }, `${action.payload.key}`, [])
      items.push(action.payload.value)
      return set({ ...state }, `${action.payload.key}`, items)
    case ACTIONS.DELETE_ITEM:
      items = get({ ...state }, `${action.payload.key}`, [])
      remove(items, (x) => x.id === action.payload.value.id)
      return set({ ...state }, `${action.payload.key}`, items)
    case ACTIONS.MOVE_ITEM_UP:
      items = get({ ...state }, `${action.payload.key}`, [])
      move(items, action.payload.value, -1)
      return set({ ...state }, `${action.payload.key}`, items)
    case ACTIONS.MOVE_ITEM_DOWN:
      items = get({ ...state }, `${action.payload.key}`, [])
      move(items, action.payload.value, 1)
      return set({ ...state }, `${action.payload.key}`, items)
    case ACTIONS.ON_INPUT:
      return set({ ...state }, action.payload.key, action.payload.value)
    case ACTIONS.SAVE_DATA:
      localStorage.setItem('state', JSON.stringify(state))
      return state
    case ACTIONS.IMPORT_DATA:
      if (action.payload === null) return initialState

      for (const section of Object.keys(initialState.data)) {
        if (!(section in action.payload.data)) {
          action.payload.data[section] = initialState.data[section]
        }
      }
      return {
        ...state,
        ...action.payload,
      }
    case ACTIONS.LOAD_DEMO_DATA:
      return {
        ...state,
        ...demoJsonldData,
      }
    case ACTIONS.RESET:
      return initialState
    default:
      return state
  }
}
