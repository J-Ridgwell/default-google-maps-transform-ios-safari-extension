//
//  ContentView.swift
//  navichoice
//
//  Created by Jacob Ridgwell on 10/24/21.
//

import SwiftUI

struct ContentView: View {
    private let url = "https://www.navichoice.app/setup";

    var body: some View {
        VStack(alignment: .leading) {
            Text("Navichoice for Safari")
                .font(.title)
                .padding(.bottom, 32)
            Button(
                action: {
                    if let url = URL(string: url) {
                        UIApplication.shared.open(url)
                        
                    }
                }) {
                    Text("Click here to enable NaviChoice directly in Safari!")
                        .font(.body)
                        .multilineTextAlignment(.leading)
                    }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
