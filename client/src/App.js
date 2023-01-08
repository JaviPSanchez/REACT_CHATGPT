// import styles from "./styles/Global";
import { useState, useEffect } from "react";
import ChatMessage from "./Components/ChatMessage";

export default function App() {
  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("ada");
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    getEngines();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "javi", message: `${input}` }];
    setInput("");
    setChatLog(chatLogNew);
    //Fetch
    const messages = chatLogNew.map((message) => message.message).join("\n");
    const response = await fetch("http://localhost:3001/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: messages,
        currentModel,
      }),
    });
    const data = await response.json();
    console.log(data.data);
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.data}` }]);
  }

  function clearChat() {
    setChatLog([]);
  }

  function getEngines() {
    fetch("http://localhost:3001/models")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.models.data);
        setModels(data.models.data);
      });
  }

  return (
    <div className="w-full flex flex-row h-screen">
      <aside className="w-1/6 bg-[#202123] p-2">
        <div
          onClick={clearChat}
          className="text-white p-4 border border-white rounded-lg text-left hover:cursor-pointer hover:bg-stone-700 transition-all"
        >
          <span className="mr-2">+</span>
          New Chat
        </div>
        <div className="">
          <select onChange={(e) => setCurrentModel(e.target.value)}>
            {models.map((model, index) => (
              <option key={model.id} value={model.id}>
                {model.id}
              </option>
            ))}
          </select>
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows="2"
              className="bg-[#40414F] w-full border border-transparent rounded-lg outline-none shadow-lg p-2 text-xl"
              placeholder="Type your prompt here"
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}
