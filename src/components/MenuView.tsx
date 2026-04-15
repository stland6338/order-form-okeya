export function MenuView() {
  return (
    <div className="w-full select-none pb-4">
      <img
        src="/menu1.jpg"
        alt="お品書き 1"
        className="block w-full h-auto"
        draggable={false}
      />
      <img
        src="/menu2.jpg"
        alt="お品書き 2"
        className="block w-full h-auto mt-2"
        draggable={false}
      />
    </div>
  );
}
