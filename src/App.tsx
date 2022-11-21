import PomodoroTimer from './components/pomodoro/Timer';
function App() {
   return (
      <div className="container">
         <PomodoroTimer
            pomodoroTimer={10}
            shortRestTime={10}
            longRestTime={600}
            cycles={4}
         />
      </div>
   );
}

export default App;
