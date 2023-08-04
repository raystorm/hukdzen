/**
 * Helper Functions for Testing MUI X-DataGrid.
 * Stolen from: https://raw.githubusercontent.com/mui/mui-x/next/test/utils/helperFn.ts 
 * 
 * Used to verify X-Datagrid is being implemented/called correctly.
 */
const headerComment = '';


/**
 * Returns the 0-based row and column index of the active cell
 */
export function getActiveCell(): string | null 
{
  let activeElement: Element | null;
  if ( document.activeElement 
    && document.activeElement.getAttribute('role') === 'cell') 
  { activeElement = document.activeElement; }
  else
  { 
    activeElement =( document.activeElement 
                  && document.activeElement.closest('[role="cell"]'));
  }

  if (!activeElement) { return null; }

  return `${activeElement.parentElement!.getAttribute('data-rowindex')}-${activeElement.getAttribute('data-colindex')}`;
}

/**
 * Returns the 0-based column index of the active column header
 */
export function getActiveColumnHeader() 
{
  let activeElement: Element | null;
  if ( document.activeElement 
    && document.activeElement.getAttribute('role') === 'columnheader') 
  { activeElement = document.activeElement; } 
  else 
  {
    activeElement =
      document.activeElement && document.activeElement.closest('[role="columnheader"]');
  }

  if (!activeElement) { return null; }

  return `${Number(activeElement.getAttribute('aria-colindex')) - 1}`;
}

/**
 *  pauses execution for duration
 *  @param duration amount of time to sleep/pause (in ms)
 *  @returns 
 */
export function sleep(duration: number) 
{
  return new Promise<void>((resolve) => 
                           { setTimeout(() => { resolve(); }, duration); });
}

export function getColumnValues(colIndex: number) 
{
  return Array.from(document.querySelectorAll(`[role="cell"][data-colindex="${colIndex}"]`))
              .map((node) => node!.textContent);
}

export function getColumnHeaderCell(colIndex: number, rowIndex?: number): HTMLElement 
{
  const headerRowSelector =
    rowIndex === undefined ? '' 
                           : `[role="row"][aria-rowindex="${rowIndex + 1}"] `;
  const headerCellSelector = `[role="columnheader"][aria-colindex="${colIndex + 1}"]`;
  const columnHeader = 
        document.querySelector<HTMLElement>(
                              `${headerRowSelector}${headerCellSelector}`,
                              );

  if (columnHeader == null) 
  { throw new Error(`columnheader ${colIndex} not found`); }
  
  return columnHeader;
}

export function getColumnHeadersTextContent() 
{
  return Array.from(document.querySelectorAll('[role="columnheader"]'))
              .map((node) => node!.textContent);
}

export function getRowsFieldContent(field: string) 
{
  return Array.from(document.querySelectorAll('[role="row"][data-rowindex]'))
              .map((node) => 
                    node.querySelector(`[role="cell"][data-field="${field}"]`)
                       ?.textContent);
}

export function getCell(rowIndex: number, colIndex: number): HTMLElement 
{
  return getCellFromElement(document, rowIndex, colIndex);
}

export function getCellFromElement(element: HTMLElement | Document, 
                                   rowIndex: number, colIndex: number): HTMLElement 
{
  const cell = 
        element.querySelector<HTMLElement>(
          `[role="row"][data-rowindex="${rowIndex}"] [role="cell"][data-colindex="${colIndex}"]`,
        );
  if ( !cell ) { throw new Error(`Cell ${rowIndex} ${colIndex} not found`); }
  return cell;
}

export function getRows() 
{ return document.querySelectorAll(`[role="row"][data-rowindex]`); }

export function getRow(rowIndex: number): HTMLElement 
{
  return getRowFromElement(document, rowIndex);
}

export function getRowFromElement(elem: HTMLElement | Document, 
                                  rowIndex: number): HTMLElement 
{
  const row = elem.querySelector<HTMLElement>(
                                `[role="row"][data-rowindex="${rowIndex}"]`
                                );
  if ( !row ) { throw new Error(`Row ${rowIndex} not found`); }
  return row;
}

/*
describe('Suite Block to keep JEST happy', () => 
{ 
  test('Do Nothing Test to Keep JEST happy', 
       () => { expect(true).toBeTruthy(); });
});
*/
