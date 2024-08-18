

export default function Profile() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold tracking-tighter ">
          Sabicoder
        </h1>

        <p className="mt-4 text-2xl text-gray-500">
           SoroGit Dapp
        </p>

        <div className="mt-16">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-center bg-gray-100 rounded-full p-1 pr-0">
              <div className="relative">
                <img
                  className="absolute inset-0 w-full h-full object-cover rounded-full"
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div className="-mr-4 ml-3">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-lg border border-gray-200">
                  <svg
                    className="h-6 w-6 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3.75 6.75c.78 0 1.41.33 1.71.79l4.25 4.25c.19.19.29.43.29.65v15.5c0 .22-.17.41-.41.41H17c-1.1 0-2-.9-2-2V8.21c0-.99-.79-1.78-1.71-1.78l-4.25-4.25A2.25 2.25 0 0013.75 6.75m0 10.5A2.5 2.5 0 0111 17.5h2.25a2.5 2.5 0 012.08 1.85l.46.46a1 1 0 001.08.11l.11.11a1 1 0 001.08.08l.11.11a1 1 0 001.08.11l.46.46A2.5 2.5 0 0117.25 23h2.25a2.5 2 0 01-2.08 1.85l-.46.46a1 1 0 00-1.08.11l-.11.11a1 1 0 00-1.08.08l-.11.11a1 1 0 00-1.08.11l-.46.46A2.5 2.5 0 0113.75 25.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-center">
         
           
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
