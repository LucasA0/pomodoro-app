import React, { useEffect, useState, useCallback } from 'react';
import { useInterval } from '../../hooks/use-interval';
import secondsToTime from '../../utils/secondsToTime';
import Button from '../Button/Index';
import Timer from '../Button/Timer';
import bellStart from '../../sounds/src_sounds_bell-start.mp3';
import bellFinish from '../../sounds/src_sounds_bell-finish.mp3';

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
   pomodoroTimer: number;
   shortRestTime: number;
   longRestTime: number;
   cycles: number;
}

const PomodoroTimer = (props: Props): JSX.Element => {
   const [mainTime, setMainTime] = useState(props.pomodoroTimer);
   const [timeCounting, setTimeCounting] = useState(false);
   const [working, setWorking] = useState(false);
   const [resting, setResting] = useState(false);
   const [cyclesQtdManager, setCyclesQtdManager] = useState(
      new Array(props.cycles - 1).fill(true),
   );

   const [completedCycles, setCompletedCycles] = useState(0);
   const [fullWorkingTime, setFullWorkingTime] = useState(0);
   const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

   useInterval(
      () => {
         setMainTime(mainTime - 1);
         if (working) setFullWorkingTime(fullWorkingTime + 1);
      },
      timeCounting ? 1000 : null,
   );

   const configureWork = useCallback(() => {
      setTimeCounting(true);
      setWorking(true);
      setResting(false);
      setMainTime(props.pomodoroTimer);
      audioStartWorking.play();
   }, [
      setTimeCounting,
      setWorking,
      setResting,
      setMainTime,
      props.pomodoroTimer,
   ]);

   const configureRest = useCallback(
      (long: boolean) => {
         setTimeCounting(true);
         setWorking(false);
         setResting(true);
         audioStopWorking.play();

         if (long) {
            setMainTime(props.longRestTime);
         } else {
            setMainTime(props.shortRestTime);
         }
      },
      [
         setTimeCounting,
         setWorking,
         setResting,
         props.longRestTime,
         props.shortRestTime,
      ],
   );

   useEffect(() => {
      if (working) {
         const root = document.getElementById('root');
         root?.classList.remove('resting');
         root?.classList.add('working');
      }
      if (resting) {
         const root = document.getElementById('root');
         root?.classList.remove('working');
         root?.classList.add('resting');
      }
      if (mainTime > 0) return;

      if (working && cyclesQtdManager.length > 0) {
         configureRest(false);
         cyclesQtdManager.pop();
      } else if (working && cyclesQtdManager.length <= 0) {
         configureRest(true);
         setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
         setCompletedCycles(completedCycles + 1);
      }

      if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
      if (resting) configureWork();
   }, [
      working,
      resting,
      mainTime,
      configureRest,
      setCyclesQtdManager,
      configureWork,
      cyclesQtdManager,
      numberOfPomodoros,
      props.cycles,
      completedCycles,
   ]);

   return (
      <div className="pomodoro">
         <div className="main-title">
            <h2>{working ? 'Trabalhando' : 'Descansando'}</h2>
         </div>
         <div className="timer">
            <h2>
               <Timer mainTime={mainTime} />
            </h2>
         </div>
         <div className="buttons-field">
            <Button text="Work" onClick={() => configureWork()} />
            <Button text="Rest" onClick={() => configureRest(false)} />
            <Button
               className={!working && !resting ? 'hidden' : ''}
               text={timeCounting ? 'Pause' : 'Play'}
               onClick={() => setTimeCounting(!timeCounting)}
            />
         </div>
         <div className="details">
            <p>Ciclos Concluídos: {completedCycles}</p>
            <p>Horas Trabalhadas: {secondsToTime(fullWorkingTime)}</p>
            <p>Pomodoros Concluídos: {numberOfPomodoros}</p>
         </div>
      </div>
   );
};

export default PomodoroTimer;
