  import React, { useState } from 'react';
  import * as XLSX from 'xlsx';

  import './App.css';
  import levis_logo from './assets/Levis_logo.png';

  function App() {
    const [data, setData] = useState([]);
    const [inputValue, setInputValue] = useState([]);
    const [quant, setQuant] = useState([]);
    const [style, setStyle] = useState(false);

    const handleFileUpload = (e) => {
      const reader = new FileReader();
      reader.readAsBinaryString(e.target.files[0]);
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, {type: "binary"});
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parseData = XLSX.utils.sheet_to_json(sheet);
        setData(parseData);
        setStyle(true);
      };
    }

    console.log(data);

    const handleInputChange = (e, index) => {
      let value = e.target.value;
      const availNow = data[index]['AVAIL NOW'];
      if(availNow < value)
      {
        value = availNow; 
      }
      const newInputValue = [...inputValue];
      newInputValue[index] = value
      setInputValue(newInputValue);
    }
    const changeOrderQuant = (index) => {
      const newQuant = [...quant];
      newQuant[index] = inputValue[index];
      setQuant(newQuant);
    }

    const imageSearch = (e) => {
      let lookFor = e;
      let google = `https://www.google.cz/search?sca_esv=9fc63cc73e9e59b8&hl=cs&sxsrf=ACQVn0-RHup-80kDjl4w_mWfqW1n7ufHyw:1709743784269&q=levis+${lookFor}&tbm=isch&source=lnms&sa=X&ved=2ahUKEwjtlav3i-CEAxXIhP0HHaUnBtcQ0pQJegQICRAB&biw=1707&bih=811&dpr=1.13#imgrc=_Mw0YRxEh1VSvM`;
      window.open(google, '_blank');
    }

    const handleCommit = () => {
      const updatedData = data.map((row,index) => ({
        ...row,
        ORDER: quant[index] || "",
      }));
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(updatedData);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

      const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'updated_file.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    }
    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
  
    return (
      <div className={style ? 'updated-App' : 'intro-App'}>
          <div className={style ? 'updated-logo' : 'intro-logo'}>
            <img src={levis_logo} alt="levis logo" onClick={() => {alert("This was created by @TomasHandzel(659687)")}}/>
          </div>
          <h1 className={style ? 'updated-upload' : 'intro-upload'}>Upload manual order excel sheet:</h1>
          <hr />
          <input type="file" accept=".xlsx, .xls" name='file' id='file' onChange={handleFileUpload} className={style ? 'updated-fileInput' : 'intro-fileInput'}/>
          <label for="file">Choose a file</label>

          <div className={style ? 'updated-buttons' : 'intro-buttons'}>
            <button onClick={() => setQuant(Array(data.length).fill(""))} className={style ? 'updated-reset' : 'intro-reset'}>Reset</button>
            <button onClick={handleCommit} className={style ? 'updated-commit' : 'intro-commit'}>Commit & Download</button>
          </div>
        {data.length > 0 && (
          <table className='table'>
            <thead>
              <tr>
                <th>Pic</th>
                <th>PC9</th>
                <th colSpan="2">Size</th>
                <th>Desc</th>
                <th>Gender</th> 
                <th>Bottoms/Tops</th>
                <th>AVAIL NOW</th>
                <th>How much?</th>
                <th>Submit</th>
                <th>Order</th>
              </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                      {index === 0 || data[index]['PC9 '] !== data[index - 1]['PC9 '] ? (<td><button className='pic' onClick={() => imageSearch(row['PC9 '])}>Images</button></td>) : (
                          <td></td>
                      )}
                      {index === 0 || data[index]['PC9 '] !== data[index - 1]['PC9 '] ? (
                        <td>{row && row['PC9 ']}</td>
                      ) : (
                        <td></td>
                      )}
                      <td>{row['W']}</td>
                      <td>{row['L']}</td>
                      <td>{row['Desc']}</td>
                      <td>{row['Gender']}</td>
                      <td>{row['Bottoms/Tops']}</td>
                      <td>{row['AVAIL NOW']}</td>
                      <td>
                        <input type="number" className='input' value={inputValue[index]} onChange={(e) => handleInputChange(e, index)}/>
                      </td>
                      <td className='sub-container'>
                        <button onClick={() => changeOrderQuant(index)}>Submit</button>
                      </td>
                      <td>
                        <p>{quant[index]}</p>
                      </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  export default App;