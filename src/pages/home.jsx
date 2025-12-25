import React from 'react';
import StarIcon from '../assets/icons/star-solid.svg';
import StarBorderIcon from '../assets/icons/star-outline.svg';
import ArrowBackIosIcon from '../assets/icons/chevron-left.svg';
import ArrowForwardIosIcon from '../assets/icons/chevron-right.svg';
import SearchIcon from '../assets/icons/search.svg';
import GridOnIcon from '../assets/icons/grid.svg';
import PaletteIcon from '../assets/icons/palette.svg';
import AccessTimeIcon from '../assets/icons/clock.svg';
import SchoolIcon from '../assets/icons/school.svg';

function Home() {
  return (
    <main className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#f9fafb' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#111827' }}>Hello Daniella 👋</h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Let's learn something new today!</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Card 1: Recommended Tutors for You */}
        <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#111827' }}>Recommended Tutors for You</h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden">
              <img src="/assets/dylans-face.png" alt="Aaron Sim" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold mb-0.5" style={{ color: '#111827' }}>Aaron Sim</div>
              <div className="text-sm mb-2" style={{ color: '#6b7280' }}>Year 2</div>
              <div className="flex items-center gap-0.5">
                <img src={StarIcon} alt="star" className="w-4 h-4" style={{ filter: 'invert(84%) sepia(31%) saturate(5885%) hue-rotate(334deg) brightness(101%) contrast(101%)' }} />
                <img src={StarIcon} alt="star" className="w-4 h-4" style={{ filter: 'invert(84%) sepia(31%) saturate(5885%) hue-rotate(334deg) brightness(101%) contrast(101%)' }} />
                <img src={StarIcon} alt="star" className="w-4 h-4" style={{ filter: 'invert(84%) sepia(31%) saturate(5885%) hue-rotate(334deg) brightness(101%) contrast(101%)' }} />
                <img src={StarIcon} alt="star" className="w-4 h-4" style={{ filter: 'invert(84%) sepia(31%) saturate(5885%) hue-rotate(334deg) brightness(101%) contrast(101%)' }} />
                <img src={StarBorderIcon} alt="star empty" className="w-4 h-4" style={{ filter: 'invert(90%) sepia(5%) saturate(166%) hue-rotate(180deg) brightness(85%) contrast(85%)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: My Upcoming Sessions */}
        <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#111827' }}>My Upcoming Sessions</h2>
          <div className="space-y-3 mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#dbeafe' }}>
              <div className="text-sm font-medium mb-1" style={{ color: '#111827' }}>CIT2C22 DevOps Essentials with <span style={{ color: '#1e40af' }}>Dylan Yeo</span></div>
              <div className="text-xs mb-2" style={{ color: '#6b7280' }}>4:00PM on 10/23/2025</div>
              <div className="text-xs cursor-pointer" style={{ color: '#9ca3af' }}>Edit/ Cancel</div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#fce7f3' }}>
              <div className="text-sm font-medium mb-1" style={{ color: '#111827' }}>CAI2C08 Machine Learning for Developers with <span style={{ color: '#1e40af' }}>Aaron Sim</span></div>
              <div className="text-xs mb-2" style={{ color: '#6b7280' }}>5:30PM on 10/27/2025</div>
              <div className="text-xs cursor-pointer" style={{ color: '#9ca3af' }}>Edit/ Cancel</div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#d1fae5' }}>
              <div className="text-sm font-medium mb-1" style={{ color: '#111827' }}>CMC2C16 IoT Application Development with <span style={{ color: '#1e40af' }}>Geng Yue</span></div>
              <div className="text-xs mb-2" style={{ color: '#6b7280' }}>1:00PM on 10/31/2025</div>
              <div className="text-xs cursor-pointer" style={{ color: '#9ca3af' }}>Edit/ Cancel</div>
            </div>
          </div>
          <button className="w-full text-center text-sm border rounded py-2" style={{ borderColor: '#e5e7eb', color: '#6b7280', backgroundColor: 'white' }}>
            see more
          </button>
        </div>

        {/* Card 3: Calendar */}
        <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <div className="flex items-center justify-between mb-3">
            <button><img src={ArrowBackIosIcon} alt="back" className="w-3.5 h-3.5 opacity-50" /></button>
            <span className="font-semibold text-sm" style={{ color: '#374151' }}>October 2025</span>
            <button><img src={ArrowForwardIosIcon} alt="next" className="w-3.5 h-3.5 opacity-50" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="py-2 font-medium" style={{ color: '#9ca3af', fontSize: '10px' }}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {[
              null, null, null, 1, 2, 3, 4,
              5, 6, 7, 8, 9, 10, 11,
              12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23, 24, 25,
              26, 27, 28, 29, 30, 31
            ].map((day, index) => (
              <div
                key={index}
                className={`py-2 ${day === 10 ? 'rounded-full font-semibold text-white' : ''}`}
                style={{
                  color: day === 10 ? 'white' : (day ? '#374151' : 'transparent'),
                  backgroundColor: day === 10 ? '#0A0338' : 'transparent'
                }}
              >
                {day || ''}
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

          <div className="relative">
            <div className="flex items-end justify-between gap-4 h-40 px-2 pb-6">
              {[
                { month: 'Jan', lessons: 20, hours: 5 },
                { month: 'Feb', lessons: 15, hours: 2 },
                { month: 'Mar', lessons: 17, hours: 2 },
                { month: 'Apr', lessons: 22, hours: 2 },
                { month: 'May', lessons: 10, hours: 1.5 }
              ].map((data, idx) => {
                const maxValue = 30;
                const totalHeight = (data.lessons + data.hours) / maxValue * 100;
                const hoursHeight = (data.hours / maxValue) * 100;
                const lessonsHeight = (data.lessons / maxValue) * 100;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="w-full h-32 flex flex-col justify-end relative">
                      <div className="w-full flex flex-col justify-end" style={{ height: `${totalHeight}%` }}>
                        <div
                          className="w-full rounded-t-sm"
                          style={{
                            height: `${(lessonsHeight / totalHeight) * 100}%`,
                            backgroundColor: '#0A0338'
                          }}
                        />
                        <div
                          className="w-full"
                          style={{
                            height: `${(hoursHeight / totalHeight) * 100}%`,
                            backgroundColor: '#fde68a'
                          }}
                        />
                      </div>
                      {data.month === 'Mar' && (
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 rounded px-2 py-1 whitespace-nowrap" style={{ backgroundColor: '#4f46e5' }}>
                          <div className="flex gap-1.5 text-xs">
                            <span className="bg-white rounded px-2 py-0.5 font-semibold" style={{ color: '#0A0338' }}>17 Hr</span>
                            <span className="bg-white rounded px-2 py-0.5 font-semibold" style={{ color: '#0A0338' }}>2 Hr</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-medium" style={{ color: '#6b7280' }}>{data.month}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs px-2" style={{ color: '#9ca3af' }}>
              <span>0 Hr</span>
              <span>10 Hr</span>
              <span>20 Hr</span>
              <span>25 Hr</span>
              <span>30 Hr</span>
            </div>
          </div>
        </div>

        {/* Row 2 - Card 5: Your Current GPA */}
        <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#111827' }}>Your Current GPA</h2>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: '#0A0338' }}></div>
            <span className="text-sm" style={{ color: '#374151' }}>Cumulative GPA</span>
          </div>
          <div className="flex justify-center items-center mb-4" style={{ height: '140px' }}>
            <div className="relative" style={{ width: '160px', height: '160px' }}>
              <svg viewBox="0 0 200 200" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="100" cy="100" r="70" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#0A0338"
                  strokeWidth="20"
                  strokeDasharray={`${(3.15 / 4) * 440} 440`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-3xl font-bold" style={{ color: '#0A0338' }}>3.15</div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <span className="text-sm" style={{ color: '#6b7280' }}>Your Grade: </span>
            <span className="text-sm font-semibold" style={{ color: '#111827' }}>3.15/4.00</span>
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
              <div key={index} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={item.checked}
                  readOnly
                  className="w-4 h-4 mt-0.5 cursor-pointer"
                  style={{ accentColor: item.checked ? '#0A0338' : undefined }}
                />
                <div className="flex-1">
                  <div className={`text-sm ${item.checked ? 'line-through' : ''}`} style={{ color: item.checked ? '#9ca3af' : '#111827' }}>
                    {item.text}
                  </div>
                  <div className="text-xs" style={{ color: '#9ca3af' }}>{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 - Card 7: Recent Sessions */}
        <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: '#111827' }}>Recent Sessions</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: '#6b7280' }}>All</span>
              <img src={SearchIcon} alt="search" className="w-5 h-5 opacity-40" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f3f4f6' }}>
                <img src={GridOnIcon} alt="grid" className="w-5 h-5 opacity-50" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold mb-1" style={{ color: '#111827' }}>User Experience (UX) Design</div>
                <div className="flex items-center gap-1 text-xs" style={{ color: '#6b7280' }}>
                  <img src={AccessTimeIcon} alt="time" className="w-3 h-3" />
                  <span>2hrs</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f3f4f6' }}>
                <img src={PaletteIcon} alt="palette" className="w-5 h-5 opacity-50" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold mb-1" style={{ color: '#111827' }}>Visual Design and Branding</div>
                <div className="flex items-center gap-1 text-xs" style={{ color: '#6b7280' }}>
                  <img src={AccessTimeIcon} alt="time" className="w-3 h-3" />
                  <span>4:00hrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3 - Card 8: Upcoming Lesson */}
        <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#111827' }}>Upcoming Lesson</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: '#e5e7eb' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f3f4f6' }}>
                <img src={SchoolIcon} alt="school" className="w-5 h-5 opacity-50" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold mb-0.5" style={{ color: '#111827' }}>DevOps Essentials</div>
                <div className="text-xs" style={{ color: '#6b7280' }}>Dylan Yeo, 4:00PM</div>
              </div>
              <button className="px-4 py-1.5 rounded text-sm font-medium text-white" style={{ backgroundColor: '#0A0338' }}>
                Join
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f3f4f6' }}>
                <img src={SchoolIcon} alt="school" className="w-5 h-5 opacity-50" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold mb-0.5" style={{ color: '#111827' }}>Machine Learning for Developers</div>
                <div className="text-xs" style={{ color: '#6b7280' }}>Aaron Sim, 5:30PM</div>
              </div>
              <button className="px-4 py-1.5 rounded text-sm font-medium text-white" style={{ backgroundColor: '#0A0338' }}>
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
