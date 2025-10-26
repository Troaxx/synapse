import React from 'react';
import './App.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import FolderIcon from '@mui/icons-material/Folder';
import NotesIcon from '@mui/icons-material/Notes';
import DownloadIcon from '@mui/icons-material/Download';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import GridOnIcon from '@mui/icons-material/GridOn';
import PaletteIcon from '@mui/icons-material/Palette';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArticleIcon from '@mui/icons-material/Article';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`} style={{ backgroundColor: '#1e293b' }}>
        {/* Logo Section */}
        <div className="p-4 mb-4" style={{ backgroundColor: 'white' }}>
          {sidebarOpen && <img src="/synapse_logo.png" alt="Synapse Logo" className="h-12" />}
        </div>
        
        <nav className="p-3 space-y-1 flex-1">
          <div className="px-3 py-2.5 flex items-center gap-3 rounded-lg font-medium" style={{ backgroundColor: '#1e40af', color: 'white' }}>
            <DashboardIcon style={{ fontSize: '20px' }} />
            <span className={sidebarOpen ? 'block text-sm' : 'hidden'}>Dashboard</span>
          </div>
          <NavItem icon={<AssignmentIcon />} text="Assignments" open={sidebarOpen} />
          <NavItem icon={<CalendarMonthIcon />} text="Schedule" open={sidebarOpen} />
          <NavItem icon={<VideocamIcon />} text="Recordings" open={sidebarOpen} />
          <NavItem icon={<ChatBubbleIcon />} text="Discussions" open={sidebarOpen} />
          <NavItem icon={<FolderIcon />} text="Resources" open={sidebarOpen} />
          <NavItem icon={<NotesIcon />} text="Notes" open={sidebarOpen} />
          <NavItem icon={<DownloadIcon />} text="Downloads" open={sidebarOpen} />
          <NavItem icon={<GroupsIcon />} text="Classes" open={sidebarOpen} />
          <NavItem icon={<SchoolIcon />} text="Courses" open={sidebarOpen} />
          <NavItem icon={<SettingsIcon />} text="Settings" open={sidebarOpen} />
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-6 border-b" style={{ backgroundColor: 'white', borderColor: '#e5e7eb' }}>
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-gray-900 px-1">
              <span style={{ fontSize: '16px' }}>{sidebarOpen ? '‹' : '›'}</span>
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center px-6 max-w-xl">
            <div className="w-full relative">
              <SearchIcon className="absolute left-3" style={{ top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '18px' }} />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full bg-gray-100 rounded-lg px-9 py-1.5 outline-none text-sm" 
                style={{ color: '#374151' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationsIcon style={{ color: '#6b7280', fontSize: '20px' }} />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#10b981' }}>
                <span className="text-white font-medium" style={{ fontSize: '12px' }}>R</span>
              </div>
              <span className="text-gray-900 text-sm">Daniella</span>
              <span className="text-gray-500" style={{ fontSize: '10px' }}>▼</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#f9fafb' }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#111827' }}>Hello Daniella 👋</h1>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Let's learn something new today!</p>
          </div>

          {/* Card Grid - 3 columns */}
          <div className="grid grid-cols-3 gap-5">
            {/* Card 1: Recommended Tutors */}
            <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              <h2 className="text-base font-semibold mb-4" style={{ color: '#111827' }}>Recommended Tutors for You</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-base font-semibold mb-0.5" style={{ color: '#111827' }}>Aaron Sim</div>
                  <div className="text-sm mb-2" style={{ color: '#6b7280' }}>Year 2</div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4].map(() => <StarIcon key={Math.random()} style={{ color: '#fbbf24', fontSize: '16px' }} />)}
                    <StarBorderIcon style={{ color: '#d1d5db', fontSize: '16px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: My Upcoming Sessions */}
            <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              <h2 className="text-base font-semibold mb-4" style={{ color: '#111827' }}>My Upcoming Sessions</h2>
              <div className="space-y-3 mb-4">
                <div className="pb-3 border-b" style={{ borderColor: '#e5e7eb' }}>
                  <div className="text-sm font-semibold mb-1" style={{ color: '#111827' }}>CIT2C22 DevOps Essentials</div>
                  <div className="text-sm mb-1" style={{ color: '#0A0338' }}>Dylan Yeo</div>
                  <div className="text-xs mb-1" style={{ color: '#6b7280' }}>4:00PM on 10/23/2025</div>
                  <div className="text-xs cursor-pointer" style={{ color: '#9ca3af' }}>Edit/Cancel</div>
                </div>
                <div className="pb-3 border-b" style={{ borderColor: '#e5e7eb' }}>
                  <div className="text-sm font-semibold mb-1" style={{ color: '#111827' }}>CAI2C08 Machine Learning for Developers</div>
                  <div className="text-sm mb-1" style={{ color: '#0A0338' }}>Aaron Sim</div>
                  <div className="text-xs mb-1" style={{ color: '#6b7280' }}>5:30PM on 10/27/2025</div>
                  <div className="text-xs cursor-pointer" style={{ color: '#9ca3af' }}>Edit/Cancel</div>
                </div>
                <div className="p-2 rounded" style={{ backgroundColor: '#ecfdf5' }}>
                  <div className="text-sm font-semibold mb-1" style={{ color: '#111827' }}>CMC2C16 IoT Application Development</div>
                  <div className="text-sm mb-1" style={{ color: '#0A0338' }}>Geng Yue</div>
                  <div className="text-xs mb-1" style={{ color: '#6b7280' }}>1:00PM on 10/31/2025</div>
                  <div className="text-xs cursor-pointer" style={{ color: '#9ca3af' }}>Edit/Cancel</div>
                </div>
              </div>
              <button className="w-full text-center text-sm border rounded py-2" style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>
                see more
              </button>
            </div>

            {/* Card 3: Calendar */}
            <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              <div className="flex items-center justify-between mb-3">
                <ArrowBackIosIcon style={{ color: '#9ca3af', fontSize: '14px' }} />
                <span className="font-semibold text-sm" style={{ color: '#374151' }}>October 2025</span>
                <ArrowForwardIosIcon style={{ color: '#9ca3af', fontSize: '14px' }} />
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div key={day} className="py-2 font-medium" style={{ color: '#9ca3af' }}>{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map(day => (
                  <div key={day} className={`py-2 ${day === 10 ? 'rounded-full font-semibold text-white' : ''}`} style={{ color: day === 10 ? 'white' : '#374151', backgroundColor: day === 10 ? '#0A0338' : 'transparent' }}>
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2 - Card 4: Your Learning Activity */}
            <div className="bg-white rounded-lg p-5 border col-span-2" style={{ borderColor: '#e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              <h2 className="text-base font-semibold mb-4" style={{ color: '#111827' }}>Your Learning Activity</h2>
              <div className="flex gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#0A0338' }}></div>
                  <span className="text-sm" style={{ color: '#6b7280' }}>Lessons Attended</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#fde68a' }}></div>
                  <span className="text-sm" style={{ color: '#6b7280' }}>Hours Spent</span>
                </div>
              </div>
              
              {/* Bar Chart */}
              <div className="flex items-end gap-3 h-40 px-2">
                {[
                  { month: 'Jan', lessons: 20, hours: 5 },
                  { month: 'Feb', lessons: 18, hours: 4 },
                  { month: 'Mar', lessons: 22, hours: 6 },
                  { month: 'Apr', lessons: 17, hours: 2 },
                  { month: 'May', lessons: 19, hours: 3 }
                ].map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="flex flex-col justify-end w-full h-32 relative">
                      <div 
                        className="absolute inset-x-0 rounded-t"
                        style={{ bottom: 0, height: `${(data.hours / 6) * 100}%`, backgroundColor: '#fde68a' }}
                      />
                      <div 
                        className="absolute inset-x-0 rounded-t"
                        style={{ bottom: `${(data.hours / 6) * 100}%`, height: `${(data.lessons / 25) * 100}%`, backgroundColor: '#0A0338' }}
                      />
                      {data.month === 'Apr' && (
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: '#0A0338' }}>
                          <div className="flex gap-1 text-xs text-white">
                            <span className="bg-white rounded px-1" style={{ color: '#0A0338' }}>17 Hr</span>
                            <span className="bg-white rounded px-1" style={{ color: '#fde68a' }}>2 Hr</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-xs" style={{ color: '#6b7280' }}>{data.month}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-8 text-xs mt-2 px-2" style={{ color: '#9ca3af' }}>
                <span>0 Hr</span>
                <span>10 Hr</span>
                <span>20 Hr</span>
                <span>25 Hr</span>
                <span>30 Hr</span>
              </div>
            </div>

            {/* Row 2 - Card 5: Your Current GPA */}
            <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              <h2 className="text-base font-semibold mb-4" style={{ color: '#111827' }}>Your Current GPA</h2>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: '#0A0338' }}></div>
                <select className="text-sm outline-none border-none bg-transparent" style={{ color: '#374151' }}>
                  <option>Cumulative GPA</option>
                  <option>Semester</option>
                </select>
              </div>
              <div className="flex justify-center items-end mb-4" style={{ height: '120px' }}>
                <div className="relative" style={{ width: '200px', height: '100px' }}>
                  <svg viewBox="0 0 200 100" className="w-full h-full">
                    <path d="M 20 80 A 80 80 0 0 1 180 80" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                    <path d="M 20 80 A 80 80 0 0 1 180 80" fill="none" stroke="#0A0338" strokeWidth="20" strokeDasharray={`${(3.15 / 4) * 251.3} 251.3`} strokeDashoffset="0" />
                    <circle cx="100" cy="80" r="5" fill="#0A0338" />
                  </svg>
                  <div className="absolute top-0 left-0 right-0 text-center">
                    <span className="text-lg font-bold" style={{ color: '#111827' }}>3.15</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm" style={{ color: '#6b7280' }}>Your Grade: 3.15</div>
              </div>
            </div>

            {/* Row 3 - Card 6: To do List */}
            <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              <h2 className="text-base font-semibold mb-4" style={{ color: '#111827' }}>To do List</h2>
              <div className="space-y-3">
                {[
                  { text: 'Human Interaction Designs', date: 'Tuesday, 30 June 2024', checked: false },
                  { text: 'Design system Basics', date: 'Monday, 24 June 2024', checked: false },
                  { text: 'Introduction to UI', date: 'Friday, 10 June 2024', checked: true },
                  { text: 'Basics of Figma', date: 'Friday, 05 June 2024', checked: true }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={item.checked}
                        readOnly
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-sm ${item.checked ? 'line-through' : ''}`} style={{ color: item.checked ? '#9ca3af' : '#111827' }}>
                        {item.text}
                      </span>
                    </div>
                    <div className="text-xs ml-6" style={{ color: '#6b7280' }}>{item.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3 - Card 7: Recent enrolled classes */}
            <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold" style={{ color: '#111827' }}>Recent enrolled classes</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: '#6b7280' }}>All</span>
                  <SearchIcon style={{ color: '#9ca3af', fontSize: '18px' }} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="border-2 rounded-lg p-4" style={{ borderColor: '#0A0338' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
                      <GridOnIcon style={{ color: '#6b7280', fontSize: '20px' }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: '#0A0338' }}>User Experience (UX) Design</div>
                      <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#6b7280' }}>
                        <span>5:30hrs</span>
                        <span>05 Lessons</span>
                        <span>Assignments</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
                      <PaletteIcon style={{ color: '#6b7280', fontSize: '20px' }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: '#111827' }}>Visual Design and Branding</div>
                      <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#6b7280' }}>
                        <span>4:00hrs</span>
                        <span>03 Lessons</span>
                        <span>Assignments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3 - Card 8: Upcoming Lesson */}
            <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              <h2 className="text-base font-semibold mb-4" style={{ color: '#111827' }}>Upcoming Lesson</h2>
              <div className="space-y-3">
                <div className="pb-3 border-b" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
                      <SchoolIcon style={{ color: '#6b7280', fontSize: '18px' }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: '#111827' }}>UX Design Fundamentals</div>
                      <div className="text-xs" style={{ color: '#6b7280' }}>5:30pm</div>
                    </div>
                    <button className="px-4 py-1.5 rounded text-sm font-medium text-white" style={{ backgroundColor: '#0A0338' }}>
                      Join
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
                      <CheckCircleIcon style={{ color: '#6b7280', fontSize: '18px' }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: '#111827' }}>Interaction Design</div>
                      <div className="text-xs" style={{ color: '#6b7280' }}>9:00pm</div>
                    </div>
                    <button className="px-4 py-1.5 rounded text-sm font-medium text-white" style={{ backgroundColor: '#0A0338' }}>
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, text, open }) {
  return (
    <div className="px-3 py-2.5 flex items-center gap-3 rounded-lg cursor-pointer transition-colors" style={{ color: '#cbd5e1' }}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      {open && <span className="text-sm">{text}</span>}
    </div>
  );
}

export default App;
