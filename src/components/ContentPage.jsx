

import RelevantPage from "./RelevantPage";
import BlogsPage from "./BlogsPage"

const ContentPage = () => {
  return (
    <div className='flex items-start w-full pl-20 pr-20 gap-12'>
      <main className='w-full md:w-4/6 p-6'>
        <BlogsPage/>
      </main>
      <aside className='hidden md:block w-2/6 h-[calc(100vh-3rem)] sticky top-12'>
        <div className='overflow-y-auto h-full hide-scrollbar'>
            <RelevantPage />
        </div>
      </aside>
    </div>
  );
};

export default ContentPage
