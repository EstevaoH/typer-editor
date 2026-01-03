import { render, screen, act, waitFor } from '@testing-library/react'
import { DocumentsProvider, useDocuments } from '../documents-context'
import userEvent from '@testing-library/user-event'
import { } from "../../context/toast-context"

// Mock child hooks to isolate context logic
const mockCreateDocument = jest.fn()
const mockUpdateDocument = jest.fn()
const mockDeleteDocument = jest.fn()
const mockSaveDocument = jest.fn()
const mockToggleFavorite = jest.fn()

jest.mock('../documents/hooks/useDocumentOperations', () => ({
    useDocumentOperations: () => ({
        createDocument: mockCreateDocument,
        updateDocument: mockUpdateDocument,
        deleteDocument: mockDeleteDocument,
        saveDocument: mockSaveDocument,
        toggleFavorite: mockToggleFavorite,
    })
}))

jest.mock('../documents/hooks/useDocumentSharing', () => ({
    useDocumentSharing: () => ({
        updateDocumentPrivacy: jest.fn(),
        updateDocumentSharing: jest.fn(),
        addToSharedWith: jest.fn(),
        removeFromSharedWith: jest.fn(),
    })
}))

const mockCreateVersion = jest.fn()
const mockRestoreVersion = jest.fn()
const mockDeleteVersion = jest.fn()
const mockUndoDelete = jest.fn()
const mockStoreDeletedDocument = jest.fn()

jest.mock('../documents/hooks/useVersionHistory', () => ({
    useVersionHistory: () => ({
        createVersion: mockCreateVersion,
        restoreVersion: mockRestoreVersion,
        deleteVersion: mockDeleteVersion,
        undoDelete: mockUndoDelete,
        storeDeletedDocument: mockStoreDeletedDocument,
    })
}))

const mockShowToast = jest.fn()
jest.mock('../../context/toast-context', () => ({
    useToast: () => ({ showToast: mockShowToast })
}))

const mockStorage = {
    isReady: true,
    loadDocuments: jest.fn().mockResolvedValue([]),
    loadFolders: jest.fn().mockResolvedValue([]),
    loadVersions: jest.fn().mockResolvedValue([]),
    loadTemplates: jest.fn().mockResolvedValue([]),
    saveDocuments: jest.fn().mockResolvedValue(undefined),
    saveFolders: jest.fn().mockResolvedValue(undefined),
    saveVersions: jest.fn().mockResolvedValue(undefined),
    saveTemplates: jest.fn().mockResolvedValue(undefined),
}

jest.mock('@/hooks/useStorage', () => ({
    useStorage: () => mockStorage
}))

jest.mock('@/hooks/useDocumentLimit', () => ({
    useDocumentLimit: () => ({ checkLimit: () => true })
}))

// Mock Date for deterministic testing
const mockDate = new Date('2023-01-01T00:00:00.000Z')
global.crypto.randomUUID = jest.fn(
    () => '00000000-0000-0000-0000-000000000000'
) as jest.MockedFunction<typeof crypto.randomUUID>;



// Test component to consume context
const TestComponent = () => {
    const {
        createDocument,
        folders,
        createFolder,
        deleteFolder,
        addTag,
        documents
    } = useDocuments()

    return (
        <div>
            <button onClick={() => createDocument('New Doc')}>Create Doc</button>
            <button onClick={() => createFolder('New Folder')}>Create Folder</button>
            <div data-testid="folder-count">{folders.length}</div>
            {folders.map(f => (
                <div key={f.id} data-testid={`folder-${f.name}`}>
                    {f.name}
                    <button onClick={() => deleteFolder(f.id)}>Delete {f.name}</button>
                </div>
            ))}
            {documents.map(d => (
                <div key={d.id} data-testid={`doc-${d.id}`}>
                    {d.tags?.join(',')}
                    <button onClick={() => addTag(d.id, 'new-tag')}>Add Tag</button>
                </div>
            ))}
        </div>
    )
}

describe('DocumentsContext', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.useFakeTimers()
        jest.setSystemTime(mockDate)
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    // it('provides document operations', async () => {
    //     render(
    //         <DocumentsProvider>
    //             <TestComponent />
    //         </DocumentsProvider>
    //     )

    //     // Wait for initial load
    //     await act(async () => {
    //         await jest.advanceTimersByTimeAsync(0)
    //     })

    //     const createBtn = screen.getByText('Create Doc')
    //     await userEvent.click(createBtn)

    //     expect(mockCreateDocument).toHaveBeenCalledWith('New Doc')
    // })

    // it('manages folders correctly', async () => {
    //     render(
    //         <DocumentsProvider>
    //             <TestComponent />
    //         </DocumentsProvider>
    //     )

    //     await act(async () => {
    //         await jest.advanceTimersByTimeAsync(0)
    //     })

    //     const createFolderBtn = screen.getByText('Create Folder')

    //     await act(async () => {
    //         await userEvent.click(createFolderBtn)
    //     })

    //     expect(screen.getByTestId('folder-count')).toHaveTextContent('1')
    //     expect(screen.getByTestId('folder-New Folder')).toBeInTheDocument()

    //     // Verify delete
    //     const deleteFolderBtn = screen.getByText('Delete New Folder')
    //     await act(async () => {
    //         await userEvent.click(deleteFolderBtn)
    //     })

    //     expect(screen.getByTestId('folder-count')).toHaveTextContent('0')
    // })

    it('initializes by loading data from storage', async () => {
        const mockDocs = [{ id: '1', title: 'Loaded Doc' }]
        mockStorage.loadDocuments.mockResolvedValueOnce(mockDocs)

        render(
            <DocumentsProvider>
                {/* Simplified test component just to trigger load */}
                <div>App</div>
            </DocumentsProvider>
        )

        await act(async () => {
            await jest.advanceTimersByTimeAsync(0)
        })

        expect(mockStorage.loadDocuments).toHaveBeenCalled()
    })
})
