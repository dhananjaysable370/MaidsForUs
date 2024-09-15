import React from 'react'
import CategorySidebar from './_components/CategorySidebar'
function layout({children}) {
  return (
      <div>
          <div className="grid grid-cols-4 mt-8">
              <div>
                  <CategorySidebar/>
              </div>
              <div className="col-span-3">   
                {children}
              </div>
          </div>
    </div>
  )
}

export default layout
