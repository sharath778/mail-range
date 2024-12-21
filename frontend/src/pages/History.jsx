import React from 'react'
import Sidebar from '../components/Sidebar'
import { Trash2 } from 'lucide-react'
import { HistoryIcon } from 'lucide-react'
const History = () => {
  return (
    <>
      <Sidebar />
      <div className='selected-content'>
        <div className='history-heading flex gap-4 items-center'>
          <h1 className='flex text-2xl md:text-3xl items-center '><HistoryIcon /> History -</h1>
          <span className=''>1</span>
        </div>
        <div className='email-list-table'>
          <table>
            <thead>

              <tr>
                <th>S No.</th>
                <th>Email</th>
                <th>From</th>
                <th>Status</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            {/* <tr>
              <td>1</td>
              <td>ankitkumar1878@gmail.com</td>
              <td>Not Send</td>
              <td> <Trash2 /> </td>
            </tr> */}
          </table>
        </div>
      </div>

    </>
  )
}

export default History