import display from "../resources/display.json" assert { type: "json" };

export default function NavBar() {
  const navbar_title = display.navbar_title;
  return (
    <nav
      class="relative w-full flex flex-wrap items-center justify-between py-3 bg-gray-100 text-gray-500 hover:text-gray-700 focus:text-gray-700 shadow-lg"
    >
      <div
        class="container-fluid w-full flex flex-wrap items-center justify-between px-6"
      >
        <div class="container-fluid">
          <a class="text-xl text-black font-semibold" href="#">
            {navbar_title}
          </a>
        </div>
      </div>
    </nav>
  );
}
