//
//  howToEnable.swift
//  navichoice
//
//  Created by Jacob Ridgwell on 10/26/21.
//

import SwiftUI
import AVKit

struct HowToEnable: View {
    let videoUrl = URL(fileURLWithPath: Bundle.main.path(forResource: "howToEnableVideo", ofType: "mov")!)
    
    var body: some View {
        VideoPlayer(player: AVPlayer(url: videoUrl))
    }
}

struct HowToEnable_Previews: PreviewProvider {
    static var previews: some View {
        HowToEnable()
    }
}
