

import RelevantPage from "./RelevantPage";
import BlogsPage from "./BlogsPage"

const ContentPage = () => {
  return (
    <div className='flex items-start w-full pl-20 pr-20 gap-12'>
      {/* Left Content: This panel will take up the available space and scroll vertically */}
      <main className='w-full md:w-4/6 p-6'>
        
        {/* Long content to demonstrate scrolling */}
        <BlogsPage/>
      </main>
      {/* Write code here to add blogs and now you can remove the dummy data i added above  as Array */}


      {/* Right Sidebar: This panel is hidden on mobile and becomes a sticky column on desktop */}
      <aside className='hidden md:block w-2/6 h-[calc(100vh-3rem)] sticky top-12'>
        {/* The inner div allows the content to scroll while the container remains fixed */}
        <div className='overflow-y-auto h-full hide-scrollbar'>
            <RelevantPage />
        </div>
      </aside>
    </div>
  );
};

export default ContentPage
