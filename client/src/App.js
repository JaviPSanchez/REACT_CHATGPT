// import styles from "./styles/Global";
import { useState, useEffect } from "react";
import ChatMessage from "./Components/ChatMessage";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

export default function App() {
  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const [inputModel, setInputModel] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [tokens, setTokens] = useState("");
  const [temperature, setTemperature] = useState({
    checked: 0,
  });

  useEffect(() => {
    getEngines();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "javi", message: `${input}` }];
    setInput("");
    setChatLog(chatLogNew);
    const messages = chatLogNew.map((message) => message.message).join("\n");
    const response = await fetch("http://localhost:3001/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: messages,
        selected,
        tokens,
        temperature,
      }),
    });
    const data = await response.json();
    console.log(data);
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.data}` }]);
  }

  function clearChat() {
    setChatLog([]);
  }

  function getEngines() {
    fetch("http://localhost:3001/models")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.models);
        setModels(data.models);
      });
  }

  return (
    <div className="w-full flex flex-row h-screen">
      <aside className="w-1/4 bg-[#202123] p-2">
        <div
          onClick={clearChat}
          className="text-white p-4 border border-white rounded-lg text-left hover:cursor-pointer hover:bg-stone-700 transition-all"
        >
          <span className="mr-2">+</span>
          New Chat
        </div>

        <div>
          <h6 className="text-white my-4">Models:</h6>
          <div
            className={`w-full font-medium h-fit text-white p-4 border border-white rounded-lg text-left hover:cursor-pointer hover:bg-stone-700 transition-all`}
          >
            <div
              onClick={() => setOpen(!open)}
              className={`bg-transparent w-full flex items-center justify-between rounded h-10  ${
                !selected && "text-white"
              }`}
            >
              {selected
                ? selected.length > 25
                  ? selected.substring(0, 25) + "..."
                  : selected
                : "Select Model"}
              <ChevronUpDownIcon
                className={`h-5 w-5 text-gray-400 ${open && "rotate-90"}`}
                aria-hidden="true"
              />
            </div>

            <ul
              className={`bg-transparent overflow-y-auto overflow-x-hidden ${
                open ? "max-h-60" : "max-h-0"
              }`}
            >
              <div className="flex items-center justify-center sticky top-0 bg-gray-600">
                <MagnifyingGlassIcon className="h-6 w-6 text-white" />
                <input
                  type="text"
                  value={inputModel}
                  onChange={(e) =>
                    setInputModel(e.target.value.toLocaleLowerCase())
                  }
                  placeholder="Enter Model name"
                  className="placeholder:text-white bg-gray-600 p-2 h-10 outline-none text-white"
                />
              </div>

              {models.map((items, index) => {
                return (
                  <li
                    className={`p-2 text-sm hover:bg-stone-600 hover:text-white ${
                      items.id.toLocaleLowerCase() ===
                        selected.toLocaleLowerCase() &&
                      "bg-transparent text-white"
                    } ${
                      items.id.toLocaleLowerCase().startsWith(inputModel)
                        ? "block"
                        : "hidden"
                    }`}
                    onClick={() => {
                      if (
                        items.id.toLocaleLowerCase() !==
                        selected.toLocaleLowerCase()
                      ) {
                        setSelected(items.id);
                        setOpen(false);
                        setInputModel("");
                      }
                    }}
                    key={index}
                  >
                    {items.id}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h6 className="text-white my-4">Max Tokens:</h6>
          <form className="text-white p-4 border border-white rounded-lg text-left hover:cursor-pointer hover:bg-stone-700 transition-all">
            <input
              type="number"
              value={tokens}
              placeholder="100"
              className="bg-transparent text-white w-full outline-none"
              onChange={(e) => {
                const num = isNaN(e.target.valueAsNumber)
                  ? null
                  : e.target.valueAsNumber;
                setTokens(num);
              }}
            />
          </form>
        </div>
        <div className="mt-4">
          <h6 className="text-white my-4">Temperature:</h6>
          <div className="w-full flex items-center justify-between font-medium h-fit text-white p-4 border rounded-lg text-left  hover:bg-stone-700 transition-all">
            <label className="text-white flex items-center hover:cursor-pointer">
              <input
                type="radio"
                value="0"
                checked={temperature.checked === "0"}
                className="w-6 h-6 mr-4 hover:cursor-pointer"
                onChange={(e) => setTemperature({ checked: e.target.value })}
              />
              0
            </label>

            <label className="text-white flex items-center hover:cursor-pointer">
              <input
                type="radio"
                value="0.5"
                checked={temperature.checked === "0.5"}
                className="w-6 h-6 mr-4 hover:cursor-pointer"
                onChange={(e) => setTemperature({ checked: e.target.value })}
              />
              0.5
            </label>

            <label className="text-white flex items-center hover:cursor-pointer">
              <input
                type="radio"
                value="1"
                checked={temperature.checked === "1"}
                className="w-6 h-6 mr-4 hover:cursor-pointer"
                onChange={(e) => setTemperature({ checked: e.target.value })}
              />
              1
            </label>
          </div>
        </div>
      </aside>
      <section className="w-5/6 h-screen bg-[#343541] flex flex-col justify-center text-white">
        <div className="h-screen overflow-y-scroll">
          {chatLog.map((item, index) => (
            <ChatMessage key={index} message={item.message} user={item.user} />
          ))}
        </div>

        <div className="p-6 w-full m-auto bg-[#343541] border-2 border-slate-600">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows="2"
              className="bg-[#40414F] w-full border border-transparent rounded-lg outline-none shadow-lg p-2 text-xl"
              placeholder="Type your prompt here"
            />
          </form>
        </div>
      </section>
    </div>
  );
}
