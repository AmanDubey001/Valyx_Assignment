import { useCallback, useState } from 'react'
import './App.css'
import SelectCategoryDropdown from './components/SelectCategoryDropdown'
import {CategoriesId} from "./Data/categoriesId"
import {CategoriesName} from "./Data/categoriesName"
function App() {
const [selectedCategories,setSelectedcategories]= useState([])
const handleChange =  useCallback((items) => {
  setSelectedcategories(prevSelectedItems => {
    const newSelectedItems = [...prevSelectedItems];
    items.forEach(item => {
      if (!newSelectedItems.includes(item.categoryId)) {
        newSelectedItems.push(item.categoryId);
      } else {
        const index = newSelectedItems.indexOf(item.categoryId);
        if (index > -1) {
          newSelectedItems.splice(index, 1);
        }
      }
    });
    return newSelectedItems;
  })
},[selectedCategories]);
  return (
     <>
     <SelectCategoryDropdown selectedCategories={selectedCategories} handleChange={handleChange} CategoriesId={CategoriesId} CategoriesName={CategoriesName} />
     </>
  )
}

export default App
