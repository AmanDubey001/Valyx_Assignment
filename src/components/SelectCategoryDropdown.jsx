import React, {useState } from 'react'

const SelectCategoryDropdown = ({selectedCategories,handleChange,CategoriesName}) => {
  const [dropDown ,setDropDown] = useState(false)
  const toggleDropdown = () => setDropDown(prev => !prev)
  const [hovered,setHovered] = useState(null)
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
    
   
    function NestedList({ items, onSelect, selectedItems }) {
      const handleClick = (item) => {
        const ancestors = Ancestors(CategoriesName?.[0]?.relationships, item?.categoryId);
        const descendants = Descendants(item);
        const allItems = [...ancestors, item, ...descendants];
        onSelect(item,allItems);
      };
  
      return (
        <ul style={{listStyleType:"none"}}>
          {Object.keys(items)?.map(key => {
            const item = items[key];
            return (
              <li key={item?.categoryId} style={{textAlign:"left",marginInline:"5px"}}>
                {!item?.categoryValue?.includes('diffnode')? ( <div 
                  id={item?.categoryId}
                  onMouseEnter={() => setHovered(item?.categoryId)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(item);
                  }}
                  style={{
                    backgroundColor: hovered === item?.categoryId ? "#E8E8E8" : "",
                    padding: "8px",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                 <input 
                    type='checkbox' 
                    id={item?.categoryId} 
                    checked={selectedItems?.includes(item?.categoryId)} 
                    onChange={(e) => {
                      e.stopPropagation();
                      handleClick(item);
                    }} 
                  />
                  <label htmlFor={item?.categoryId}>{item?.categoryValue}</label>
                </div>): (<></>)}
                {item?.children && (
                  <NestedList
                    items={item?.children}
                    onSelect={onSelect}
                    selectedItems={selectedItems}
                  />
                )}
              </li>
            );
          })}
        </ul>
      );
    }
    



  return (
    <div>
<input 
style={{padding:"10px"}}
type="text" 
 placeholder={` Select Categories    ${dropDown ? '▼' : '▲'}` }
  onClick={toggleDropdown} 
  readOnly 

            />   
      {
       dropDown &&  <div style={{maxHeight:"400px",maxWidth:"400px",marginTop:"10px",marginInline:"auto",overflow:"scroll",overflowX:"hidden",boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}><NestedList
       items={CategoriesName?.[0]?.relationships}
       onSelect={handleChange}
       selectedItems={selectedCategories}/></div>
      }
    </div>
  )
}

export default SelectCategoryDropdown
