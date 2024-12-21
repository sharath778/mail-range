import React from 'react'
import Sidebar from '../components/Sidebar'
import { Trash2 } from 'lucide-react'
const EmailList = () => {
  return (
    <>
      <Sidebar />
      <div className='selected-content'>
        <div className="dashboard-email-list">

          <div className='email-list'>
            <div className='email-list-heading'>
              <h1 className=''>Email-List -</h1>
              <span className=''>1</span>
            </div>
            <div className='email-list-button'>
              <button >Add Mail</button>
              <button >Send Mails</button>
              <button >Add Mail Details</button>
            </div>
          </div>

          <div className='email-list-table'>
            <table>
              <thead>
                <tr>
                  <th>S No.</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>ankitkumar1878@gmail.com</td>
                  <td>Not Send</td>
                  <td> <Trash2 /> </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </>
  )
}

export default EmailList