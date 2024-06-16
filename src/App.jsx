import { useCallback, useState } from 'react'
import './App.css'
import SelectCategoryDropdown from './components/SelectCategoryDropdown'
import {CategoriesId} from "./Data/categoriesId"
import {CategoriesName} from "./Data/categoriesName"
function App() {
const [selectedCategories,setSelectedcategories]= useState([])

const Descendants = (category) => {
  let descendants = [];
  if (category?.children) {
    for (let key in category?.children) {
      const child = category?.children[key];
      descendants.push(child);
      descendants = descendants.concat(Descendants(child));
    }
  }
  return descendants;
};
const Ancestors = (data, targetId, ancestors = []) => {
  for (let key in data) {
    const item = data[key];
    if (item?.categoryId === targetId) {
      return ancestors;
    }
    if (item?.children) {
      const result = Ancestors(item?.children, targetId, [...ancestors, item]);
      if (result) {
        return result;
      }
    }
  }
  return null;
};
const areAllChildrenSelected = (item, selectedItems) => {
  if (!item.children) return true; // No children to check
  const descendants = Descendants(item);
  return descendants.every(desc => selectedItems.includes(desc.categoryId));
};

const handleChange = (item, items) => {
  setSelectedcategories((prevSelectedItems) => {
    let newSelectedItems = [...prevSelectedItems];

    if (!newSelectedItems.includes(item.categoryId)) {
      // Select item and its descendants
      items.forEach((i) => {
        if (!newSelectedItems.includes(i?.categoryId)) {
          newSelectedItems.push(i?.categoryId);
        }
      });
    } else {
      // Deselect item and its descendants
      items?.forEach((i) => {
        const index = newSelectedItems.indexOf(i?.categoryId);
        if (index > -1) {
          newSelectedItems.splice(index, 1);
        }
      });

      // Ensure ancestors are not deselected when a child is deselected
      const ancestors = Ancestors(CategoriesName?.[0]?.relationships, item?.categoryId);
      ancestors.forEach((ancestor) => {
        if (ancestor.children) {
          const allChildrenDeselected = Object.values(ancestor?.children).every(child =>
            !newSelectedItems.includes(child?.categoryId)
          );
          if (!allChildrenDeselected && !newSelectedItems.includes(ancestor?.categoryId)) {
            newSelectedItems.push(ancestor?.categoryId);
          }
        }
      });
    }

    // Ensure ancestors are selected if all their children are selected
    const ancestors = Ancestors(CategoriesName?.[0]?.relationships, item?.categoryId);
    ancestors.forEach((ancestor) => {
      if (ancestor.children) {
        const allChildrenSelected = areAllChildrenSelected(ancestor, newSelectedItems);
        if (allChildrenSelected && !newSelectedItems.includes(ancestor?.categoryId)) {
          newSelectedItems.push(ancestor?.categoryId);
        }
      }
    });

    // Remove duplicates in case of double adding
    newSelectedItems = [...new Set(newSelectedItems)];

    return newSelectedItems;
  });
};

  return (
     <>
     <SelectCategoryDropdown selectedCategories={selectedCategories} handleChange={handleChange} CategoriesId={CategoriesId} CategoriesName={CategoriesName} />
     </>
  )
}

export default App
