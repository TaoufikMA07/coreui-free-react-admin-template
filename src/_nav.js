import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'User Info',
  },
 
  {
    component: CNavItem,
    name: 'Users',
    to: '/Users',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Carte',
    to: '/Carte',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Trajet',
  },
  {
    component: CNavItem,
    name: 'Gare',
    to: '/Gare',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  
  {
    component: CNavItem,
    name: 'Ligne',
    to: '/Ligne',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Infrastructure',
  },
  {
    component: CNavItem,
    name: 'Train',
    to: '/Train',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Voiture',
    to: '/Voiture',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
 
  
]

export default _nav
