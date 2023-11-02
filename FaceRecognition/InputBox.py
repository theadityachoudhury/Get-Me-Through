import tkinter as tk


class RequestCaller(tk.Tk):
    def __init__(self):
        super().__init__()
        self.x1 = 0
        self.entry1 = 0
        self.run_button()


    def get_event_id(self):
        self.x1 = self.entry1.get()
        print(self.x1)
        self.destroy()

         # Close the window when the button is pressed

    def run_button(self):
        canvas1 = tk.Canvas(self, width=400, height=300, relief='raised')
        canvas1.pack()

        label1 = tk.Label(self, text='Enter the Event ID')
        label1.config(font=('SansSerif', 20))
        canvas1.create_window(200, 90, window=label1)

        self.entry1 = tk.Entry(self, width=15, font=('Helvetica', 16))
        canvas1.create_window(200, 140, window=self.entry1)

        button1 = tk.Button(self, text='Get the Event ID', command=self.get_event_id, bg='brown', fg='white',
                           font=('helvetica', 9, 'bold'))
        canvas1.create_window(200, 190, window=button1, width=185, height=40)


# if __name__ == "__main__":
#     test1 = RequestCaller()
#     test1.mainloop()
